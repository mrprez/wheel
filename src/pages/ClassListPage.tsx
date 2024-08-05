import React, { useState } from 'react';
import StudentClass from '../model/StudentClass';
import AddClassDialog from '../dialogs/AddClassDialog';
import studentClassDao from '../dao/StudentClassDao';
import ListComponent, {ListItemProps, ListProps} from '../components/ListComponent';


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

    const classListItems = classList.map((studentClass :StudentClass) => (
        {
            key: studentClass.id,
            title: studentClass.name,
            onClickCallback: () => {props.goToClassCallback(studentClass)}
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
            <button className='btn' onClick={onClick}>Ajouter</button>
        </div>
    );
}
