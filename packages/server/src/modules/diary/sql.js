import { orderedFor } from "../../sql/helpers";
import knex from "../../sql/connector";

export default class Student {
  studentsPagination(limit, after) {
    let where = "";
    if (after > 0) {
      where = `id < ${after}`;
    }

    return knex
      .select("id", "firstName", "lastName")
      .from("student")
      .whereRaw(where)
      .orderBy("id", "desc")
      .limit(limit);
  }

  async getDiarysForStudentIds(StudentIds) {
    const res = await knex
      .select("id", "subject", "activity", "note", "Student_id AS StudentId")
      .from("diary")
      .whereIn("Student_id", StudentIds);

    return orderedFor(res, StudentIds, "StudentId", false);
  }

  getTotal() {
    return knex("Student")
      .countDistinct("id as count")
      .first();
  }

  getNextPageFlag(id) {
    return knex("Student")
      .countDistinct("id as count")
      .where("id", "<", id)
      .first();
  }

  student(id) {
    return knex
      .select("id", "firstName", "lastName")
      .from("Student")
      .where("id", "=", id)
      .first();
  }

  addStudent({ firstName, lastName }) {
    return knex("Student")
      .insert({ firstName, lastName })
      .returning("id");
  }

  deleteStudent(id) {
    return knex("Student")
      .where("id", "=", id)
      .del();
  }

  editStudent({ id, firstName, lastName }) {
    return knex("Student")
      .where("id", "=", id)
      .update({
        firstName: firstName,
        lastName: lastName
      });
  }

  addDiary({ subject, activity, note, StudentId }) {
    return knex("Diary")
      .insert({ subject, activity, note, Student_id: StudentId })
      .returning("id");
  }

  getDiary(id) {
    return knex
      .select("id", "subject", "activity", "note")
      .from("Diary")
      .where("id", "=", id)
      .first();
  }

  deleteDiary(id) {
    return knex("Diary")
      .where("id", "=", id)
      .del();
  }

  editDiary({ id, subject, activity, note }) {
    return knex("Diary")
      .where("id", "=", id)
      .update({
        subject: subject,
        activity: activity,
        note: note
      });
  }
}
