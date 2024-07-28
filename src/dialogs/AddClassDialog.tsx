import { useEffect, useRef, useState } from "react";
import StudentClass from "../model/StudentClass";

type AddClassDialogProps = {
    displayed: boolean,
    callback: (studentClass: StudentClass) => void,
    onClose: () => void
}

export default function AddClassDialog({displayed, callback, onClose} : AddClassDialogProps) {
    const dialog = useRef(null);
    const name = useRef(null);
    
    useEffect(() => {
        if (displayed) {
            (dialog.current as unknown as HTMLDialogElement).showModal();
        }
    });

    const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        const newClass = new StudentClass(-1, (name.current as unknown as HTMLInputElement).value);
        callback(newClass);
    };

    const onCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
        (dialog.current as unknown as HTMLDialogElement).close();
    };

    return (
        <dialog ref={dialog} onClose={onClose}>
            <form method="dialog" onSubmit={onSubmit} className="dialog-content">
                <div className="dialog-title">Classe</div>
                <div className="dialog-main">
                    <div className="input-field">
                        <label htmlFor="className">Nom de la classe</label>
                        <input id="className" type="text" required autoFocus ref={name}/>
                    </div>
                </div>
                <div className="dialog-buttons">
                    <button className="btn" type="submit">Valider</button>
                    <button className="btn bland" type="button" onClick={onCancel}>Annuler</button>
                </div>
            </form>
        </dialog>  
    );
}