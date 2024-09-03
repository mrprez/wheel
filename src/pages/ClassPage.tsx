import StudentClass from "../model/StudentClass";
import studentClassDao from "../dao/StudentClassDao";
import { useRef, useState } from "react";
import StudentListDialog from "../dialogs/StudentListDialog";
import Student from "../model/Student";
import {BackIcon, MenuIcon} from "../components/icons/Icons";
import WheelComponent from "../components/WheelComponent";


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

    const drawStudentCallback = (student :Student) => {
        student.drawCount++;
        const updatedStudentList = studentList.map((s) => s.key === student.key ? student : s);
        // studentClassDao.saveStudentList(props.studentClass.id, updatedStudentList);
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
            <main className="class-page">
                <WheelComponent students={studentList} drawCallback={drawStudentCallback}/>
                {studentList.length === 0 ? <NoStudentMessage/> : null}

                <StudentListDialog classId={props.studentClass.id} studentList={studentList} ref={studentListDialogRef} validateCallback={saveStudentListCallback}/>
            </main>
        </>
    );
}

function NoStudentMessage() {
    return (
        <div className="no-student-message">
            <p>Aucun élève dans cette classe.</p>
            <p>Cliquez sur l'icône en haut à droite pour ajouter des élèves.</p>
        </div>
    );
}

function DrawnStudentMessage(props :{student :Student}) {
    return (
        <div className="drawn-student-message">
            <p>{props.student.firstname} {props.student.lastname}</p>
            <p>Bravo !</p>
        </div>
    );
}
