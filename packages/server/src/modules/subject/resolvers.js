import { withFilter } from "graphql-subscriptions";
import { createBatchResolver } from "graphql-resolve-batch";

const ACTIVITY_SUBSCRIPTION = "activity_subscription";
const ACTIVITYS_SUBSCRIPTION = "activitys_subscription";

export default pubsub => ({
  Query: {
    async activitys(obj, {}, context) {
      return await context.Activity.activitys();
    },
    async subjects(obj, {}, context) {
      return await context.Activity.subjects();
    },
    activity(obj, { id }, context) {
      return context.Activity.activity(id);
    }
  },
  Mutation: {
    async addActivity(obj, { input }, context) {
      const [id] = await context.Activity.addActivity(input);
      const activity = await context.Activity.activity(id);
      // publish for activity list
      pubsub.publish(ACTIVITYS_SUBSCRIPTION, {
        activitysUpdated: {
          mutation: "CREATED",
          id,
          node: activity
        }
      });
      return activity;
    },
    async deleteActivity(obj, { id }, context) {
      const activity = await context.Activity.activity(id);
      const isDeleted = await context.Activity.deleteActivity(id);
      if (isDeleted) {
        // publish for activity list
        pubsub.publish(ACTIVITYS_SUBSCRIPTION, {
          activitysUpdated: {
            mutation: "DELETED",
            id,
            node: activity
          }
        });
        return { id: activity.id };
      } else {
        return { id: null };
      }
    },
    async editActivity(obj, { input }, context) {
      await context.Activity.editActivity(input);
      const activity = await context.Activity.activity(input.id);
      // publish for activity list
      pubsub.publish(ACTIVITYS_SUBSCRIPTION, {
        activitysUpdated: {
          mutation: "UPDATED",
          id: activity.id,
          node: activity
        }
      });
      // publish for edit activity page
      pubsub.publish(ACTIVITY_SUBSCRIPTION, { activityUpdated: activity });
      return activity;
    }
  },
  Subscription: {
    activityUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ACTIVITY_SUBSCRIPTION),
        (payload, variables) => {
          return payload.activityUpdated.id === variables.id;
        }
      )
    },
    activitysUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ACTIVITYS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.activitysUpdated.id;
        }
      )
    }
  }
});
