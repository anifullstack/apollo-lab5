import COMMENT_QUERY_CLIENT from "../graphql/CommentQuery.client.graphql";

const TYPE_NAME = "CommentState";
const TYPE_NAME_COMMENT = "Comment";

const defaults = {
  comment: {
    id: null,
    content: "YYYYYYY",
    __typename: TYPE_NAME_COMMENT
  },
  __typename: TYPE_NAME
};

const resolvers = {
  Query: {
    commentState: (_, args, { cache }) => {
      const { comment: { comment } } = cache.readQuery({
        query: COMMENT_QUERY_CLIENT
      });
      console.log("client", "resolvers", "query", "comment", comment);

      return {
        comment: {
          ...comment,
          __typename: TYPE_NAME_COMMENT
        },
        __typename: TYPE_NAME
      };
    }
  },
  Mutation: {
    onCommentSelect: async (_, { comment }, { cache }) => {
      await cache.writeData({
        data: {
          comment: {
            ...comment,
            __typename: TYPE_NAME_COMMENT
          },
          __typename: TYPE_NAME
        }
      });

      return null;
    }
  }
};

export default {
  defaults,
  resolvers
};
