import StudentClass from "../model/StudentClass";
import studentClassDao from "../dao/StudentClassDao";
import { useRef, useState } from "react";
import StudentListDialog from "../dialogs/StudentListDialog";


type ClassPageProps = {
    studentClass :StudentClass,
    goToClassListCallback :()=>void
}

export default function ClassPage(props :ClassPageProps) {
    const [studentList, setStudentList] = useState(studentClassDao.listClassStudents(props.studentClass.id));
    const studentListDialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <header>
                <GoToClassListButton onClick={props.goToClassListCallback}/>
                <div>Classe {props.studentClass.name}</div>
                <button onClick={() => studentListDialogRef.current?.showModal()}>Liste des élèves</button>
            </header>
            <main>
                <StudentListDialog studentList={studentList} ref={studentListDialogRef}/>
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



