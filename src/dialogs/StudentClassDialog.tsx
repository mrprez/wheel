import { forwardRef, Ref, RefObject, useRef } from "react";
import StudentClass from "../model/StudentClass";

type StudentClassDialogProps = {
    studentClass: StudentClass,
    validateCallback :(studentClass :StudentClass) => void
}

export default forwardRef(function StudentClassDialog(props :StudentClassDialogProps, ref :Ref<HTMLDialogElement>) {
    const classId = props.studentClass.id;
    const className = props.studentClass.name;

    const classNameInputRef = useRef<HTMLInputElement>(null);

    const validateCallback = () => {
        if (classNameInputRef.current) {
            const newStudentClass = new StudentClass(classId, classNameInputRef.current?.value);
            props.validateCallback(newStudentClass);
            (ref as RefObject<HTMLDialogElement>).current?.close();
        }
    };
    const cancelCallback = () => {
        (ref as RefObject<HTMLDialogElement>).current?.close();
        if (classNameInputRef.current) {
            classNameInputRef.current.value = props.studentClass.name;
        }
    };

    return (
        <dialog ref={ref}>
            <form method="dialog" onSubmit={validateCallback} className="dialog-content">
                <div className="dialog-title">Classe</div>
                <div className="dialog-main">
                    <div className="input-field">
                        <label htmlFor="className">Nom de la classe</label>
                        <input id="className" type="text" defaultValue={className} required autoFocus ref={classNameInputRef}/>
                    </div>
                </div>
                <div className="dialog-buttons">
                    <button className="btn" type="submit">Valider</button>
                    <button className="btn secondary" type="button" onClick={cancelCallback}>Annuler</button>
                </div>
            </form>
        </dialog>  
    );
})