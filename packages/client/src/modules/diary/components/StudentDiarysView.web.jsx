import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
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

  handleEditDiary = (id, subject, activity, activityDate, note) => {
    const { onDiarySelect } = this.props;
    onDiarySelect({ id, subject, activity, activityDate, note });
  };

  handleDeleteDiary = id => {
    const { diary, onDiarySelect, deleteDiary } = this.props;

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

  onSubmit = () => values => {
    const { diary, studentId, addDiary, editDiary, onDiarySelect } = this.props;

    if (diary.id === null) {
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
  };

  render() {
    const { studentId, diarys, diary } = this.props;
    console.log(
      "StudentDiarysViewWeb",
      "render",
      "studentId",
      studentId,
      "diarys",
      diarys,
      "diary",
      diary
    );
    const updatedDiarys = diarys.map(d => {
      const tempActivityDate = moment(parseInt(d.activityDate)).format(
        "MMM Do"
      );
      return {
        ...d,
        activityDate: tempActivityDate
      };
    });
    console.log(
      "StudentDiarysViewWeb",
      "updatedDiarys",
      JSON.stringify(updatedDiarys)
    );
    const columns = [
      {
        title: "Date",
        dataIndex: "activityDate",
        key: "activityDate"
      },
      {
        title: "Subject",
        dataIndex: "subject",
        key: "subject"
      },
      {
        title: "Activity",
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
              onClick={() =>
                this.handleEditDiary(
                  record.id,
                  record.subject,
                  record.activity,
                  record.activityDate,
                  record.note
                )
              }
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
        <Table dataSource={updatedDiarys} columns={columns} />
      </div>
    );
  }
}
