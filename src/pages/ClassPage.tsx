import StudentClass from "../model/StudentClass";
import studentClassDao from "../dao/StudentClassDao";
import { useRef, useState } from "react";
import StudentListDialog from "../dialogs/StudentListDialog";
import Student from "../model/Student";


type ClassPageProps = {
    studentClass :StudentClass,
    goToClassListCallback :()=>void
}

export default function ClassPage(props :ClassPageProps) {
    const [studentList, setStudentList] = useState(studentClassDao.listClassStudents(props.studentClass.id));
    
    const studentListDialogRef = useRef<HTMLDialogElement>(null);

    const saveStudentListCallback = (studentList :Student[]) => {
        studentClassDao.saveStudentList(props.studentClass.id, studentList);
    };

    return (
        <>
            <header>
                <GoToClassListButton onClick={props.goToClassListCallback}/>
                <div>Classe {props.studentClass.name}</div>
                <button onClick={() => studentListDialogRef.current?.showModal()}>Liste des élèves</button>
            </header>
            <main>
                <StudentListDialog classId={props.studentClass.id} studentList={studentList} ref={studentListDialogRef} validateCallback={saveStudentListCallback}/>
            </main>
        </>
    );
}


type GoToClassListButtonProps = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function GoToClassListButton({onClick} : GoToClassListButtonProps) {
    return (
        <div className="ClassListBtnCtn">
            <button onClick={onClick}>Liste des classes</button>
        </div>
    );
}



