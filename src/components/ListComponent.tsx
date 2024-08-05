import { MouseEvent } from "react";
import { EditIcon } from "./icons/Icons";

export type ListItemProps = {
    id: number,
    title: string,
    onClickCallback?: () => void,
    editCallback?: () => void
}

export type ListProps = {
    items :ListItemProps[]
}


export default function ListComponent(props: ListProps) {
    return (
        <div className='list'>
            {props.items.map((item) => 
                <ListItem key={item.id} {...item}/>
            )}
        </div>
    );
}


function ListItem(props :ListItemProps) {
    const itemClassName = props.onClickCallback ? 'item active' : 'item';

    const editButton = props.editCallback ? 
        <button className='btn btn-icon' onClick={stopPropagationWrapper(props.editCallback)}><EditIcon/></button> : null;

    return (
        <div className={itemClassName} onClick={props.onClickCallback} id={String(props.id)}>
            <div className='item-content'>
                <span className='item-title'>{props.title}</span>
            </div>
            <div className='actions'>
                {editButton}
            </div>
        </div>
    )
}


const stopPropagationWrapper = function(callback :() => void) {
    return (event :MouseEvent) => {
        event.stopPropagation();
        callback();
    };
}