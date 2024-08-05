import React, { useRef, useState } from 'react';
import StudentClass from '../model/StudentClass';
import AddClassDialog from '../dialogs/AddClassDialog';
import studentClassDao from '../dao/StudentClassDao';
import ListComponent, {ListItemProps} from '../components/ListComponent';
import StudentClassDialog from '../dialogs/StudentClassDialog';


type ClassListPageProps = {
    goToClassCallback: (studentClass: StudentClass) => void
}

export default function ClassListPage(props :ClassListPageProps) {
    const [classList, setClassList] = useState(studentClassDao.listClasses());
    const [editedClass, setEditedClass] = useState<StudentClass>(new StudentClass(0, ""));
    
    const studentClassDialogRef = useRef<HTMLDialogElement>(null);

    const validateClassDialogCallback = (newClass: StudentClass) => {
        if (newClass.id > 0) {
            studentClassDao.updateClass(newClass);
        } else {
            studentClassDao.createClass(newClass);
        }
        setClassList(studentClassDao.listClasses());
    }
    const addClassCallback = () => {
        if (studentClassDialogRef.current) {
            setEditedClass(new StudentClass(0, ""));
            studentClassDialogRef.current.showModal();
        }
    }

    const classListItems = classList.map((studentClass :StudentClass) => (
        {
            id: studentClass.id,
            title: studentClass.name,
            onClickCallback: () => {props.goToClassCallback(studentClass)},
            editCallback: () => {
                if (studentClassDialogRef.current) {
                    setEditedClass(studentClass);
                    studentClassDialogRef.current.showModal();
                }
            }
        } as ListItemProps
    ));

    return (
        <>
            <header>
                <h1>Liste des classes</h1>
            </header>
            <main className='class-list-page'>
                <ListComponent items={classListItems}/>
                <NoClassStoredMessage classCount={classList.length}/>
                <div className="addClassCtn">
                    <button className='btn' onClick={addClassCallback}>Ajouter</button>
                </div>
                <StudentClassDialog studentClass={editedClass} validateCallback={validateClassDialogCallback} ref={studentClassDialogRef}/>
            </main>
        </>
    );
}


type NoClassStoredMessageProps = { classCount :number };

function NoClassStoredMessage({classCount} : NoClassStoredMessageProps) {
    if (classCount === 0) {
        return <div>Aucune classe enregistrée</div>;
    }
    return null;
}


type AddClassButtonProps = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function AddClassButton({onClick} : AddClassButtonProps) {
    return (
        <div className="addClassCtn">
            <button className='btn' onClick={onClick}>Ajouter</button>
        </div>
    );
}
