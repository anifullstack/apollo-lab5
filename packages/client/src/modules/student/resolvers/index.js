import DIARY_QUERY_CLIENT from "../graphql/DiaryQuery.client.graphql";

const TYPE_NAME = "DiaryState";
const TYPE_NAME_DIARY = "Diary";

const defaults = {
  diary: {
    id: null,
    content: "YYYYYYY",
    __typename: TYPE_NAME_DIARY
  },
  __typename: TYPE_NAME
};

const resolvers = {
  Query: {
    diaryState: (_, args, { cache }) => {
      const { diary: { diary } } = cache.readQuery({
        query: DIARY_QUERY_CLIENT
      });
      console.log("client", "resolvers", "query", "diary", diary);

      return {
        diary: {
          ...diary,
          __typename: TYPE_NAME_DIARY
        },
        __typename: TYPE_NAME
      };
    }
  },
  Mutation: {
    onDiarySelect: async (_, { diary }, { cache }) => {
      console.log("client", "resolvers", "mutation", "diary", diary);
      await cache.writeData({
        data: {
          diary: {
            ...diary,
            __typename: TYPE_NAME_DIARY
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
