import { withFilter } from "graphql-subscriptions";
import { createBatchResolver } from "graphql-resolve-batch";

const STUDENT_SUBSCRIPTION = "student_subscription";
const STUDENTS_SUBSCRIPTION = "students_subscription";
const DIARY_SUBSCRIPTION = "diary_subscription";

export default pubsub => ({
  Query: {
    async students(obj, { limit, after }, context) {
      let edgesArray = [];
      let students = await context.Student.studentsPagination(limit, after);

      students.map(student => {
        edgesArray.push({
          cursor: student.id,
          node: {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            birthDate: student.birthDate
          }
        });
      });

      const endCursor =
        edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      const values = await Promise.all([
        context.Student.getTotal(),
        context.Student.getNextPageFlag(endCursor)
      ]);

      return {
        totalCount: values[0].count,
        edges: edgesArray,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: values[1].count > 0
        }
      };
    },
    student(obj, { id }, context) {
      return context.Student.student(id);
    }
  },
  Student: {
    diarys: createBatchResolver((sources, args, context) => {
      return context.Student.getDiarysForStudentIds(
        sources.map(({ id }) => id)
      );
    })
  },
  Mutation: {
    async addStudent(obj, { input }, context) {
      const [id] = await context.Student.addStudent(input);
      const student = await context.Student.student(id);
      // publish for student list
      pubsub.publish(STUDENTS_SUBSCRIPTION, {
        studentsUpdated: {
          mutation: "CREATED",
          id,
          node: student
        }
      });
      return student;
    },
    async deleteStudent(obj, { id }, context) {
      const student = await context.Student.student(id);
      const isDeleted = await context.Student.deleteStudent(id);
      if (isDeleted) {
        // publish for student list
        pubsub.publish(STUDENTS_SUBSCRIPTION, {
          studentsUpdated: {
            mutation: "DELETED",
            id,
            node: student
          }
        });
        return { id: student.id };
      } else {
        return { id: null };
      }
    },
    async editStudent(obj, { input }, context) {
      await context.Student.editStudent(input);
      const student = await context.Student.student(input.id);
      // publish for student list
      pubsub.publish(STUDENTS_SUBSCRIPTION, {
        studentsUpdated: {
          mutation: "UPDATED",
          id: student.id,
          node: student
        }
      });
      // publish for edit student page
      pubsub.publish(STUDENT_SUBSCRIPTION, { studentUpdated: student });
      return student;
    },
    async addDiary(obj, { input }, context) {
      const [id] = await context.Student.addDiary(input);
      const diary = await context.Student.getDiary(id);
      // publish for edit student page
      pubsub.publish(DIARY_SUBSCRIPTION, {
        diaryUpdated: {
          mutation: "CREATED",
          id: diary.id,
          studentId: input.studentId,
          node: diary
        }
      });
      return diary;
    },
    async deleteDiary(obj, { input: { id, studentId } }, context) {
      await context.Student.deleteDiary(id);
      // publish for edit student page
      pubsub.publish(DIARY_SUBSCRIPTION, {
        diaryUpdated: {
          mutation: "DELETED",
          id,
          studentId,
          node: null
        }
      });
      return { id };
    },
    async editDiary(obj, { input }, context) {
      await context.Student.editDiary(input);
      const diary = await context.Student.getDiary(input.id);
      // publish for edit student page
      pubsub.publish(DIARY_SUBSCRIPTION, {
        diaryUpdated: {
          mutation: "UPDATED",
          id: input.id,
          studentId: input.studentId,
          node: diary
        }
      });
      return diary;
    }
  },
  Subscription: {
    studentUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(STUDENT_SUBSCRIPTION),
        (payload, variables) => {
          return payload.studentUpdated.id === variables.id;
        }
      )
    },
    studentsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(STUDENTS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.studentsUpdated.id;
        }
      )
    },
    diaryUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(DIARY_SUBSCRIPTION),
        (payload, variables) => {
          return payload.diaryUpdated.studentId === variables.studentId;
        }
      )
    }
  }
});
