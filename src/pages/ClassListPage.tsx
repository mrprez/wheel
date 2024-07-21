import React, { useState } from 'react';
import StudentClass from '../model/StudentClass';
import AddClassDialog from '../dialogs/AddClassDialog';
import studentClassDao from '../dao/StudentClassDao';
import ClassListComponent from '../components/ClassListComponent';


type ClassListPageProps = {
    goToClassCallback: (studentClass: StudentClass) => void
}

export default function ClassListPage(props :ClassListPageProps) {
    const [classList, setClassList] = useState(studentClassDao.listClasses());
    const [addClassDialogDisplayed, setAddClassDialogDisplayed] = useState(false);

    const addClassCallback = (newClass: StudentClass) => {
        studentClassDao.createClass(newClass);
        setClassList(studentClassDao.listClasses());
    }

    return (
        <>
            <header>
                Liste des classes
            </header>
            <main>
                <ClassListComponent list={classList} goToClassCallback={props.goToClassCallback}/>
                <NoClassStoredMessage classCount={classList.length}/>
                <AddClassButton onClick={() => setAddClassDialogDisplayed(true)}/>
                <AddClassDialog displayed={addClassDialogDisplayed} 
                        callback={addClassCallback}
                        onClose={() => setAddClassDialogDisplayed(false)}/>
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
            <button onClick={onClick}>Ajouter</button>
        </div>
    );
}
