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
    const [rotation, setRotation] = useState(0);
    const weightSum = studentList.reduce((sum, student) => sum + getStudentWeigth(student), 0);

    const studentListDialogRef = useRef<HTMLDialogElement>(null);

    const saveStudentListCallback = (studentList :Student[]) => {
        setStudentList(studentList);
        studentClassDao.saveStudentList(props.studentClass.id, studentList);
    };

    const getStudentPart = (student: Student) => {
        return getStudentWeigth(student) / weightSum;
    }

    const draw = () => {
        if (!drawnStudent) {
            const random = Math.random() * weightSum;
            const drawnStudent = getDrawnStudent(studentList, random).draw();
            const rotation = Math.floor((4.25 + random / weightSum) * 360);
            studentClassDao.saveStudentList(props.studentClass.id, studentList.map((s) => {
                if (s.key === drawnStudent.key) {
                    return drawnStudent;
                } else {
                    return s.copy();
                }
            }));
            setRotation(rotation);
            setDrawnStudent(drawnStudent);
        }
    };

    const cancelDrawCallback = () => {
        studentClassDao.saveStudentList(props.studentClass.id, studentList);
        setDrawnStudent(null);
        setRotation(0);
    };

    const closeDrawCallback = () => {
        setStudentList(studentClassDao.listClassStudents(props.studentClass.id));
        setDrawnStudent(null);
        setRotation(0);
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
                {studentList.length > 0 ? <WheelComponent students={studentList} rotation={rotation} getStudentPart={getStudentPart}/> : null}
                {studentList.length > 0 ? <button className="btn large" onClick={draw}>Lancer</button> : null}
                {studentList.length === 0 ? <NoStudentMessage/> : null}
                {drawnStudent ? <DrawnStudentMessage student={drawnStudent} cancelCallback={cancelDrawCallback} closeDrawCallback={closeDrawCallback}/> : null}
                <StudentListDialog classId={props.studentClass.id} studentList={studentList} ref={studentListDialogRef}
                                   validateCallback={saveStudentListCallback}/>
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
    cancelCallback :()=>void,
    closeDrawCallback :()=>void
}

function DrawnStudentMessage(props :DrawnStudentMessageProps) {
    return (
        <div className="drawn-student-message">
            <div className="title">{props.student.firstname} {props.student.lastname}</div>
            <div className="draw-count">Tiré {props.student.drawCount} fois</div>
            <div className="buttons">
                <button className="btn secondary" onClick={props.cancelCallback}>Annuler</button>
                <button className="btn" onClick={props.closeDrawCallback}>Fermer</button>
            </div>
        </div>
    );
}



function getStudentWeigth(student: Student): number {
    return 1 / Math.pow(2, student.drawCount);
}

function getDrawnStudent(studentList: Student[], random: number): Student {
    let sum = 0;
    for (const student of studentList) {
        sum += getStudentWeigth(student);
        if (sum >= random) {
            return student;
        }
    }
    throw new Error('No student found');
}
