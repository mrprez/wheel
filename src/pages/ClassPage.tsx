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
    const [drawnStudent, setDrawnStudent] = useState<Student | null>(null);

    const studentListDialogRef = useRef<HTMLDialogElement>(null);

    const saveStudentListCallback = (studentList :Student[]) => {
        setStudentList(studentList);
        studentClassDao.saveStudentList(props.studentClass.id, studentList);
    };

    const drawStudentCallback = (student :Student) => {
        const updatedStudentList = studentList.map((s) => {
            if (s.key === student.key) {
                const updatedStudent = s.draw();
                setDrawnStudent(updatedStudent);
                return updatedStudent;
            } else {
                return s.copy();
            }
        });
        studentClassDao.saveStudentList(props.studentClass.id, updatedStudentList);
    };

    const cancelDrawCallback = () => {
        studentClassDao.saveStudentList(props.studentClass.id, studentList);
        setDrawnStudent(null);
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
                {studentList.length > 0 ? <WheelComponent students={studentList} drawCallback={drawStudentCallback}/> : null}
                {studentList.length === 0 ? <NoStudentMessage/> : null}
                {drawnStudent ? <DrawnStudentMessage student={drawnStudent} cancelCallback={cancelDrawCallback}/> : null}
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

type DrawnStudentMessageProps = {
    student :Student,
    cancelCallback :()=>void
}

function DrawnStudentMessage(props :DrawnStudentMessageProps) {
    return (
        <div className="drawn-student-message">
            <div className="title">{props.student.firstname} {props.student.lastname}</div>
            <div className="draw-count">Tiré {props.student.drawCount} fois</div>
            <div className="buttons">
                <button className="btn secondary" onClick={props.cancelCallback}>Annuler</button>
                <button className="btn">Fermer</button>
            </div>
        </div>
    );
}
