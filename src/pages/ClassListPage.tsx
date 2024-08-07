import React, { useRef, useState } from 'react';
import StudentClass from '../model/StudentClass';
import studentClassDao from '../dao/StudentClassDao';
import ListComponent, {ListItemProps} from '../components/ListComponent';
import StudentClassDialog from '../dialogs/StudentClassDialog';
import ConfirmDialog, { ConfirmDialogProps } from '../dialogs/ConfirmDialog';


type ClassListPageProps = {
    goToClassCallback: (studentClass: StudentClass) => void
}

export default function ClassListPage(props :ClassListPageProps) {
    const [classList, setClassList] = useState(studentClassDao.listClasses());
    const [editedClass, setEditedClass] = useState<StudentClass>(new StudentClass(0, ""));
    const [confirmDialogProps, setConfirmDialogProps] = useState<ConfirmDialogProps>({
        title: "",
        text: "",
        validateCallback: () => null
    });
    
    const studentClassDialogRef = useRef<HTMLDialogElement>(null);
    const confirmDialogRef = useRef<HTMLDialogElement>(null);

    const validateClassDialogCallback = (newClass: StudentClass) => {
        if (newClass.id > 0) {
            studentClassDao.updateClass(newClass);
        } else {
            studentClassDao.createClass(newClass);
        }
        setClassList(studentClassDao.listClasses());
    };
    const addClassCallback = () => {
        if (studentClassDialogRef.current) {
            setEditedClass(new StudentClass(0, ""));
            studentClassDialogRef.current.showModal();
        }
    };
    const editCallbackBuilder = (studentClass :StudentClass) => {
        return () => {
            if (studentClassDialogRef.current) {
                setEditedClass(studentClass);
                studentClassDialogRef.current.showModal();
            }
        };
    };
    const deleteCallbackBuilder = (studentClass :StudentClass) => {
        return () => {
            setConfirmDialogProps({
                title: 'Supprimer la classe ?',
                text: 'Etes-vous sûr de vouloir supprimer la classe "' + studentClass.name + '" avec tous ces élèves ?',
                validateCallback: () => {
                    studentClassDao.deleteClass(studentClass.id);
                    setClassList(studentClassDao.listClasses());
                }
            });
            if (confirmDialogRef.current) {
                confirmDialogRef.current.showModal();
            }
        };
    };

    const classListItems = classList.map((studentClass :StudentClass) => (
        {
            id: studentClass.id,
            title: studentClass.name,
            onClickCallback: () => {props.goToClassCallback(studentClass)},
            editCallback: editCallbackBuilder(studentClass),
            deleteCallback: deleteCallbackBuilder(studentClass)
        } as ListItemProps
    ));

    const noClassStoredMessage = classList.length === 0 ? <div>Aucune classe enregistrée</div> : null

    return (
        <>
            <header>
                <h1>Liste des classes</h1>
            </header>
            <main className='class-list-page'>
                <ListComponent items={classListItems}/>
                {noClassStoredMessage}
                <div className="addClassCtn">
                    <button className='btn' onClick={addClassCallback}>Ajouter</button>
                </div>
                <StudentClassDialog studentClass={editedClass} validateCallback={validateClassDialogCallback} ref={studentClassDialogRef}/>
                <ConfirmDialog {...confirmDialogProps} ref={confirmDialogRef}/>
            </main>
        </>
    );
}

