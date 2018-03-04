import Activity from "./sql";
import schema from "./schema.graphql";
import createResolvers from "./resolvers";
import Feature from "../connector";

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Activity: new Activity() })
});
