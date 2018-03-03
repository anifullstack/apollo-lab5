import React from "react";
import PropTypes from "prop-types";
import { Table, Button } from "../../common/components/web";
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

  handleEditDiary = (id, subject, activity, note) => {
    const { onDiarySelect } = this.props;
    onDiarySelect({ id, subject, activity, note });
  };

  handleDeleteDiary = id => {
    const { diary, onDiarySelect, deleteDiary } = this.props;

    if (diary.id === id) {
      onDiarySelect({ id: null, subject: "", activity: "", note: "" });
    }

    deleteDiary(id);
  };

  onSubmit = () => values => {
    const { diary, studentId, addDiary, editDiary, onDiarySelect } = this.props;

    if (diary.id === null) {
      addDiary(values.subject, values.activity, values.note, studentId);
    } else {
      editDiary(diary.id, values.subject, values.activity, values.note);
    }

    onDiarySelect({ id: null, subject: "", activity: "", note: "" });
  };

  render() {
    const { studentId, diarys, diary } = this.props;
    console.log(
      "StudentDiarysViewWeb",
      "render",
      "studentId",
      studentId,
      "diary",
      diary
    );
    const columns = [
      {
        title: "Subjct",
        dataIndex: "subject",
        key: "subject"
      },
      {
        title: "activity",
        dataIndex: "activity",
        key: "activity"
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note"
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-diary"
              onClick={() => this.handleEditDiary(record.id, record.note)}
            >
              Edit
            </Button>{" "}
            <Button
              color="primary"
              size="sm"
              className="delete-diary"
              onClick={() => this.handleDeleteDiary(record.id)}
            >
              Delete
            </Button>
          </div>
        )
      }
    ];

    return (
      <div>
        <h3>Diarys</h3>
        <StudentDiaryForm
          studentId={studentId}
          onSubmit={this.onSubmit()}
          initialValues={diary}
          diary={diary}
        />
        <h1 />
        <Table dataSource={diarys} columns={columns} />
      </div>
    );
  }
}
