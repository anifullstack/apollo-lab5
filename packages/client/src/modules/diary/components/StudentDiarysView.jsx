import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, FlatList, Text, View, Keyboard } from "react-native";
import { SwipeAction } from "../../common/components/native";

import StudentDiaryForm from "./StudentDiaryForm";

export default class StudentDiarysView extends React.PureComponent {
  static propTypes = {
    studentId: PropTypes.number.isRequired,
    diarys: PropTypes.array.isRequired,
    diary: PropTypes.object,
    addDiary: PropTypes.func.isRequired,
    editDiary: PropTypes.func.isRequired,
    deleteDiary: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    onDiarySelect: PropTypes.func.isRequired
  };

  keyExtractor = item => item.id;

  renderItem = ({ item: { id, subject, activity, activityDate, note } }) => {
    const { diary, deleteDiary, onDiarySelect } = this.props;
    const tempsubject = subject ? subject : "";
    const tempactivity = activity ? activity : "";
    const tempnote = note ? note : "";
    const tempActivityDate = activityDate ? activityDate : "";
    return (
      <SwipeAction
        onPress={() =>
          onDiarySelect({
            id: id,
            subject: subject,
            activity: activity,
            activityDate: activityDate,
            note: note
          })
        }
        right={{
          text: "Delete",
          onPress: () =>
            this.onDiaryDelete(diary, deleteDiary, onDiarySelect, id)
        }}
      >
        {tempsubject}: {tempactivity}: {tempnote}
      </SwipeAction>
    );
  };

  onDiaryDelete = (diary, deleteDiary, onDiarySelect, id) => {
    if (diary.id === id) {
      onDiarySelect({
        id: null,
        subject: "",
        activity: "",
        activityDate: "",
        note: ""
      });
    }

    deleteDiary(id);
  };

  onSubmit = (
    diary,
    studentId,
    addDiary,
    editDiary,
    onDiarySelect
  ) => values => {
    if (!diary || diary.id === null) {
      addDiary(
        values.subject,
        values.activity,
        values.activityDate,
        values.note,
        studentId
      );
    } else {
      editDiary(
        diary.id,
        values.subject,
        values.activity,
        values.activityDate,
        values.note
      );
    }

    onDiarySelect({
      id: null,
      subject: "",
      activity: "",
      activityDate: "",
      note: ""
    });
    Keyboard.dismiss();
  };

  render() {
    const {
      studentId,
      diary,
      addDiary,
      editDiary,
      diarys,
      onDiarySelect
    } = this.props;

    return (
      <View>
        <Text style={styles.title}>Diarys</Text>
        <StudentDiaryForm
          studentId={studentId}
          onSubmit={this.onSubmit(
            diary,
            studentId,
            addDiary,
            editDiary,
            onDiarySelect
          )}
          diary={diary}
        />
        {diarys.length > 0 && (
          <View style={styles.list} keyboardDismissMode="on-drag">
            <FlatList
              data={diarys}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    margin: 10
  },
  list: {
    paddingTop: 10
  }
});
