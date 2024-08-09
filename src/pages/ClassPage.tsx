import StudentClass from "../model/StudentClass";
import studentClassDao from "../dao/StudentClassDao";
import { useRef, useState } from "react";
import StudentListDialog from "../dialogs/StudentListDialog";
import Student from "../model/Student";
import {BackIcon, MenuIcon} from "../components/icons/Icons";


type ClassPageProps = {
    studentClass :StudentClass,
    goToClassListCallback :()=>void
}

export default function ClassPage(props :ClassPageProps) {
    const [studentList, setStudentList] = useState(studentClassDao.listClassStudents(props.studentClass.id));
    
    const studentListDialogRef = useRef<HTMLDialogElement>(null);

    const saveStudentListCallback = (studentList :Student[]) => {
        setStudentList(studentList);
        studentClassDao.saveStudentList(props.studentClass.id, studentList);
    };

    return (
        <>
            <header>
                <button className="back-btn" onClick={props.goToClassListCallback}><BackIcon/></button>
                <h1>Classe {props.studentClass.name}</h1>
                <div className="toolbar">
                    <button className="btn btn-icon" onClick={() => studentListDialogRef.current?.showModal()} title="Liste des élèves">
                        <MenuIcon/>
                    </button>
                </div>
            </header>
            <main>
                <StudentListDialog classId={props.studentClass.id} studentList={studentList} ref={studentListDialogRef} validateCallback={saveStudentListCallback}/>
            </main>
        </>
    );
}
