import React from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import update from "immutability-helper";

import StudentDiarysView from "../components/StudentDiarysView";

import ADD_DIARY from "../graphql/AddDiary.graphql";
import EDIT_DIARY from "../graphql/EditDiary.graphql";
import DELETE_DIARY from "../graphql/DeleteDiary.graphql";
import DIARY_SUBSCRIPTION from "../graphql/DiarySubscription.graphql";
import ADD_DIARY_CLIENT from "../graphql/AddDiary.client.graphql";
import DIARY_QUERY_CLIENT from "../graphql/DiaryQuery.client.graphql";

function AddDiary(prev, node) {
  //console.log("Client", "SD", "AddDiary", "prev", prev, "node", node);
  // ignore if duplicate
  if (
    node.id !== null &&
    prev.student.diarys.some(diary => node.id !== null && node.id === diary.id)
  ) {
    return prev;
  }

  return update(prev, {
    student: {
      diarys: {
        $push: [node]
      }
    }
  });
}

function DeleteDiary(prev, id) {
  const index = prev.student.diarys.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    student: {
      diarys: {
        $splice: [[index, 1]]
      }
    }
  });
}

class StudentDiarys extends React.Component {
  static propTypes = {
    studentId: PropTypes.number.isRequired,
    diarys: PropTypes.array.isRequired,
    diary: PropTypes.object,
    onDiarySelect: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
    console.log(
      "Client",
      "Containers",
      "StudentDiarys",
      "constuctor",
      "props",
      JSON.stringify(this.props)
    );
  }

  componentWillReceiveProps(nextProps) {
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.studentId !== nextProps.studentId) {
      this.subscription = null;
    }

    // Subscribe or re-subscribe
    if (!this.subscription) {
      this.subscribeToDiaryList(nextProps.studentId);
    }
  }

  componentWillUnmount() {
    this.props.onDiarySelect({
      id: null,
      subject: "",
      activity: "",
      activityDate: "",
      note: ""
    });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToDiaryList = studentId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: DIARY_SUBSCRIPTION,
      variables: { studentId },
      updateQuery: (
        prev,
        { subscriptionData: { data: { diaryUpdated: { mutation, id, node } } } }
      ) => {
        let newResult = prev;

        if (mutation === "CREATED") {
          newResult = AddDiary(prev, node);
        } else if (mutation === "DELETED") {
          newResult = DeleteDiary(prev, id);
        }

        return newResult;
      }
    });
  };

  render() {
    console.log(
      "Client",
      "Containers",
      "StudentDiarys",
      "render",
      "props",
      JSON.stringify(this.props)
    );
    return <StudentDiarysView {...this.props} />;
  }
}

const StudentDiarysWithApollo = compose(
  graphql(ADD_DIARY, {
    props: ({ mutate }) => ({
      addDiary: (subject, activity, activityDate, note, studentId) =>
        mutate({
          variables: {
            input: { subject, activity, activityDate, note, studentId }
          },
          optimisticResponse: {
            __typename: "Mutation",
            addDiary: {
              __typename: "Diary",
              id: null,
              subject: subject,
              activity: activity,
              activityDate: activityDate,
              note: note
            }
          },
          updateQueries: {
            student: (prev, { mutationResult: { data: { addDiary } } }) => {
              if (prev.student) {
                prev.student.diarys = prev.student.diarys.filter(
                  diary => diary.id
                );
                return AddDiary(prev, addDiary);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_DIARY, {
    props: ({ ownProps: { studentId }, mutate }) => ({
      editDiary: (id, subject, activity, activityDate, note) =>
        mutate({
          variables: {
            input: { id, studentId, subject, activity, activityDate, note }
          },
          optimisticResponse: {
            __typename: "Mutation",
            editDiary: {
              __typename: "Diary",
              id: id,
              subject: subject,
              activity: activity,
              activityDate: activityDate,
              note: note
            }
          }
        })
    })
  }),
  graphql(DELETE_DIARY, {
    props: ({ ownProps: { studentId }, mutate }) => ({
      deleteDiary: id =>
        mutate({
          variables: { input: { id, studentId } },
          optimisticResponse: {
            __typename: "Mutation",
            deleteDiary: {
              __typename: "Diary",
              id: id
            }
          },
          updateQueries: {
            student: (prev, { mutationResult: { data: { deleteDiary } } }) => {
              if (prev.student) {
                return DeleteDiary(prev, deleteDiary.id);
              }
            }
          }
        })
    })
  }),
  graphql(ADD_DIARY_CLIENT, {
    props: ({ mutate }) => ({
      onDiarySelect: diary => {
        mutate({ variables: { diary: diary } });
      }
    })
  }),
  graphql(DIARY_QUERY_CLIENT, {
    props: ({ data: { diary } }) => ({ diary })
  })
)(StudentDiarys);

export default StudentDiarysWithApollo;
