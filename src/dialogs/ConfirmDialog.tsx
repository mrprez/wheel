import { forwardRef, Ref, RefObject } from "react";


export type ConfirmDialogProps = {
    title: string,
    text: string,
    validateCallback: () => void
}

export default forwardRef(function ConfirmDialog(props :ConfirmDialogProps, ref :Ref<HTMLDialogElement>) {
    return (
        <dialog ref={ref}>
            <form method="dialog" onSubmit={props.validateCallback} className="dialog-content">
                <div className="dialog-title">{props.title}</div>
                <div className="dialog-main">
                    {props.text}
                </div>
                <div className="dialog-buttons">
                    <button className="btn" type="submit">Valider</button>
                    <button className="btn secondary" type="button" onClick={() => (ref as RefObject<HTMLDialogElement>).current?.close()}>Annuler</button>
                </div>
            </form>
        </dialog>  
    );
});