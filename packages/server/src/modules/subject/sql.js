import { orderedFor } from "../../sql/helpers";
import knex from "../../sql/connector";

export default class Activity {
  activitys() {
    return knex
      .select("id", "subject", "name")
      .from("activity")
      .orderBy("subject", "name");
  }

  subjects() {
    return knex
      .select("id", "name")
      .from("subject")
      .orderBy("name");
  }

  getTotal() {
    return knex("Activity")
      .countDistinct("id as count")
      .first();
  }

  getNextPageFlag(id) {
    return knex("Activity")
      .countDistinct("id as count")
      .where("id", "<", id)
      .first();
  }

  activity(id) {
    return knex
      .select("id", "subject", "name")
      .from("Activity")
      .where("id", "=", id)
      .first();
  }

  addActivity({ subject, name }) {
    return knex("Activity")
      .insert({ subject, name })
      .returning("id");
  }

  deleteActivity(id) {
    return knex("Activity")
      .where("id", "=", id)
      .del();
  }

  editActivity({ id, subject, name }) {
    return knex("Activity")
      .where("id", "=", id)
      .update({
        subject: subject,
        activity: name
      });
  }
}
