import { LegacyRef, Ref, RefObject, forwardRef, useRef, useState } from "react";
import Student from "../model/Student";

type StudentListDialogProps = {
    studentList :Student[]
}


export default forwardRef(function StudentListDialog(props :StudentListDialogProps, ref :Ref<HTMLDialogElement>) {
  const [newStudentDisplayed, displayNewStudent] = useState(false);
  
  const cancelCallback = () => {
    (ref as RefObject<HTMLDialogElement>).current?.close();
  };

  const addStudentCallback = () => {
    displayNewStudent(true);
  };

  return (
      <dialog ref={ref}>
        <form method="dialog">
          {props.studentList.map((student) => <StudentLine firstname={student.firstname} lastname={student.lastname}/>)}
          {props.studentList.length === 0 && <div>Aucun élève enregistré.</div>}
          {!newStudentDisplayed && <button type="button" onClick={addStudentCallback}>Ajouter un élève</button>}
          {newStudentDisplayed && <NewStudentLine/>}
        </form>
        <div className="buttonsCtn">
          <button onClick={cancelCallback}>Annuler</button>
        </div>
      </dialog>
    );
});


type StudentLineProps = {
    firstname :string,
    lastname :string
}

function StudentLine(props :StudentLineProps) {
    return (
      <div>
        <input type="text" value={props.firstname} autoFocus/>
        <input type="text" value={props.lastname}/>
      </div>
    );
}


function NewStudentLine() {
  return (
    <div>
      <input type="text"/>
      <input type="text"/>
    </div>
  );
}
