import { Ref, RefObject, forwardRef, useRef, useState } from "react";
import Student from "../model/Student";
import {CheckIcon, CrossIcon, DeleteIcon, EditIcon} from "../components/icons/Icons";

type StudentListDialogProps = {
    classId :number,
    studentList :Student[],
    validateCallback :(studentList :Student[]) => void
}


export default forwardRef(function StudentListDialog(props :StudentListDialogProps, ref :Ref<HTMLDialogElement>) {
  const [studentList, setStudentList] = useState(props.studentList.map((student) => new Student(student.id, student.classId, student.firstname, student.lastname)));

  const validateCallback = () => {
    props.validateCallback(studentList);
    (ref as RefObject<HTMLDialogElement>).current?.close();
  };
  const cancelCallback = () => {
    (ref as RefObject<HTMLDialogElement>).current?.close();
    setStudentList(props.studentList); 
  };

  const createStudentCallback = (student :Student) => setStudentList([...studentList, student]);
  const updateStudentCallback = (studentUpdate :Student) => {
    setStudentList(studentList.map((student) => {
      if (student.id === studentUpdate.id) {
        return studentUpdate;
      } else {
        return student;
      }
    }))
  };
  const deleteStudentCallback = (deletedStudent :Student) => {
    setStudentList(studentList.filter(student => student !== deletedStudent));
  }

  return (
      <dialog className="student-list-dialog" ref={ref}>
          <form method="dialog" className="dialog-content">
              <div className="dialog-title">Liste des élèves</div>
              <div className="dialog-main">
                  {studentList.map((student, index) =>
                      <StudentLine key={index} student={student} updateCallback={updateStudentCallback} deleteCallback={deleteStudentCallback}/>
                  )}
                  {studentList.length === 0 && <div>Aucun élève enregistré.</div>}
                  <AddStudentLine classId={props.classId} validateCallback={createStudentCallback}/>
              </div>
              <div className="dialog-buttons">
                  <button className="btn" onClick={validateCallback}>Valider</button>
                  <button className="btn secondary" onClick={cancelCallback}>Annuler</button>
              </div>
          </form>
      </dialog>
  );
});


type AddStudentLineProps = {
    classId: number,
    validateCallback: (student: Student) => void
}

function AddStudentLine(props: AddStudentLineProps) {
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
      <div className="student-line">
        <input type="text" placeholder="Prénom" ref={firstnameInput} autoFocus/>
        <input type="text" placeholder="Nom" ref={lastnameInput}/>
        <div className="toolbar">
          <button className="btn btn-icon" type="button" onClick={validateCallback}><CheckIcon/></button>
          <button className="btn btn-icon" type="button" onClick={cancelCallback}><CrossIcon/></button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <button className="btn" type="button" onClick={() => displayForm(true)}>Ajouter un élève</button>
      </div>
    );
  }
}


type StudentLineProps = {
    student :Student,
    updateCallback :(student :Student) => void,
    deleteCallback :(student :Student) => void
}

function StudentLine(props :StudentLineProps) {
    const [editable, setEditable] = useState(false);

    const firstnameInput = useRef<HTMLInputElement>(null);
    const lastnameInput = useRef<HTMLInputElement>(null);

    const cancelCallback = () => {
      if (firstnameInput.current && lastnameInput.current) {
        firstnameInput.current.value = props.student.firstname;
        lastnameInput.current.value = props.student.lastname;
        setEditable(false);
      }
    };
    const validateCallback = () => {
      if (firstnameInput.current && lastnameInput.current) {
        props.updateCallback(new Student(props.student.id, props.student.classId, firstnameInput.current.value, lastnameInput.current.value));
      }
    };
    const deleteCallback = () => {
      props.deleteCallback(props.student);
    }

    return (
      <div className="student-line">
        <input type="text" value={props.student.firstname} ref={firstnameInput} disabled={!editable} autoFocus/>
        <input type="text" value={props.student.lastname} ref={lastnameInput} disabled={!editable}/>
        <div className="toolbar">
          {editable &&  <button type="button" className="btn btn-icon" onClick={validateCallback}><CheckIcon/></button>}
          {editable &&  <button type="button" className="btn btn-icon" onClick={cancelCallback}><CrossIcon/></button>}
          {!editable && <button type="button" className="btn btn-icon" onClick={() => setEditable(true)}><EditIcon/></button>}
          {!editable && <button type="button" className="btn btn-icon" onClick={deleteCallback}><DeleteIcon/></button>}
        </div>
      </div>
    );
}

