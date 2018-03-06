import casual from "casual";
import moment from "moment";
import { truncateTables } from "../../sql/helpers";
import subjects from "./../lookup/subjects";

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ["student", "comment"]);

  await Promise.all(
    [...Array(20).keys()].map(async ii => {
      const student = await knex("student")
        .returning("id")
        .insert({
          firstName: `${casual.first_name}`,
          lastName: `${casual.last_name}`
        });

      const randomSubject = casual.random_element(subjects);

      await Promise.all(
        [...Array(3).keys()].map(async jj => {
          const randomActivity = casual.random_element(
            randomSubject.activities
          );
          const delta = casual.integer(1, 60);
          const randomActivityDate = moment().subtract(delta, "days");
          console.log(
            "server",
            "seed",
            "student",
            "randomActivityDate",
            randomActivityDate
          );
          return knex("diary")
            .returning("id")
            .insert({
              student_id: student[0],
              subject: randomSubject.name,
              activity: randomActivity.name,
              activityDate: randomActivityDate.valueOf(),
              status: `status ${jj + 1} for student ${student[0]}`,
              note: `diary note ${jj + 1} for student ${student[0]}`
            });
        })
      );
    })
  );
}
