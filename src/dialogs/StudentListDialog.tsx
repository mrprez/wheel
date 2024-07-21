import { LegacyRef, forwardRef } from "react";
import Student from "../model/Student";

type StudentListDialogProps = {
    studentList :Student[]
}


export default forwardRef(function StudentListDialog(props :StudentListDialogProps, ref :LegacyRef<HTMLDialogElement>) {
    return (
      <dialog ref={ref}>
        <form method="dialog">
          <StudentList studentList={props.studentList}/>
          {props.studentList.length === 0 && <div>Aucun élève enregistré.</div>}
        </form>
      </dialog>
    );
});


type StudentListProps = {
    studentList :Student[]
}

function StudentList(props :StudentListProps) {
    return (
      <div>
        {props.studentList.map(student => <div>{student.firstname}</div>)}
      </div>
    );
}
