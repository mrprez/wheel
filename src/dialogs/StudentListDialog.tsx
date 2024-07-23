import { Ref, RefObject, forwardRef, useCallback, useRef, useState } from "react";
import Student from "../model/Student";

type StudentListDialogProps = {
    classId :number,
    studentList :Student[],
    validateCallback :(studentList :Student[]) => void
}


export default forwardRef(function StudentListDialog(props :StudentListDialogProps, ref :Ref<HTMLDialogElement>) {
  const [studentList, setStudentList] = useState(props.studentList.map((student) => new Student(student.key, student.classId, student.firstname, student.lastname)));

  const validateCallback = () => {
    props.validateCallback(studentList);
    (ref as RefObject<HTMLDialogElement>).current?.close();
  };
  const cancelCallback = () => {
    (ref as RefObject<HTMLDialogElement>).current?.close();
    setStudentList(props.studentList); 
  };

  return (
      <dialog ref={ref}>
        <form method="dialog">
          {studentList.map((student) => <StudentLine firstname={student.firstname} lastname={student.lastname} editable={false}/>)}
          {studentList.length === 0 && <div>Aucun élève enregistré.</div>}
          <AddStudentLine classId={props.classId} validateCallback={(student) => setStudentList([...studentList, student])}/>
        </form>
        <div className="buttonsCtn">
          <button onClick={validateCallback}>Valider</button>
          <button onClick={cancelCallback}>Annuler</button>
        </div>
      </dialog>
    );
});


type AddStudentLineProps = {
  classId :number,
  validateCallback :(student :Student) => void
}

function AddStudentLine(props :AddStudentLineProps) {
  const [formDisplayed, displayForm] = useState(false);
  
  const firstnameInput = useRef<HTMLInputElement>(null);
  const lastnameInput = useRef<HTMLInputElement>(null);

  const validateCallback = () => {
    if (firstnameInput.current && lastnameInput.current) {
      const student = new Student(0, props.classId, firstnameInput.current.value, lastnameInput.current.value);
      firstnameInput.current.value = "";
      lastnameInput.current.value = "";
      props.validateCallback(student);
      firstnameInput.current.focus();
    }
  }
  const cancelCallback = () => {
    if (firstnameInput.current && lastnameInput.current) {
      firstnameInput.current.value = "";
      lastnameInput.current.value = "";
      displayForm(false);
    }
  };

  if (formDisplayed) {
    return (
      <div>
        <input type="text" ref={firstnameInput} autoFocus/>
        <input type="text" ref={lastnameInput}/>
        <button type="button" onClick={validateCallback}>Valider</button>
        <button type="button" onClick={cancelCallback}>Annuler</button>
      </div>
    );
  } else {
    return (
      <div>
        <button type="button" onClick={() => displayForm(true)}>Ajouter un élève</button>
      </div>
    );
  }
}


type StudentLineProps = {
    firstname :string,
    lastname :string,
    editable :boolean
}

function StudentLine(props :StudentLineProps) {
    const [editable, setEditable] = useState(props.editable);

    const firstnameInput = useRef<HTMLInputElement>(null);
    const lastnameInput = useRef<HTMLInputElement>(null);

    const cancelCallback = () => {
      if (firstnameInput.current && lastnameInput.current) {
        firstnameInput.current.value = props.firstname;
        lastnameInput.current.value = props.lastname;
        setEditable(false);
      }
    };
    
    return (
      <div>
        <input type="text" value={props.firstname} ref={firstnameInput} disabled={!editable} autoFocus/>
        <input type="text" value={props.lastname} ref={lastnameInput} disabled={!editable}/>
        <button type="button" className={editable ? "" : "hidden"}>Valider</button>
        <button type="button" className={editable ? "" : "hidden"} onClick={cancelCallback}>Annuler</button>
        <button type="button" className={editable ? "hidden" : ""} onClick={() => setEditable(true)}>Modifier</button>
        <button type="button" className={editable ? "hidden" : ""}>Supprimer</button>
      </div>
    );
}

