import StudentClass from '../model/StudentClass';
import { DeleteIcon, EditIcon } from './icons/Icons';

type ClassListProps = {
    list: StudentClass[],
    goToClassCallback: (studentClass: StudentClass) => void,
    editClassCallback: (studentClass: StudentClass) => void,
}


export default function ClassListComponent(props: ClassListProps) {
    return (
        <div className='list'>
            {props.list.map((studentClass) => 
                <ClassListItem key={studentClass.id}
                    name={studentClass.name}
                    goToClassCallback={() => props.goToClassCallback(studentClass)}
                    editClassCallback={() => props.editClassCallback(studentClass)}/>
            )}
        </div> 
    );
}


type ClassListItemProps = {
    key :number,
    name: string,
    goToClassCallback: () => void,
    editClassCallback: () => void
};

function ClassListItem(props :ClassListItemProps) {
    return (
        <div className='item active' onClick={props.goToClassCallback}>
            <div className='item-content'>
                <span className='item-title'>{props.name}</span>
            </div>
            <div className='actions'>
                <button className='btn btn-icon'>
                    <DeleteIcon />
                </button>
                <button className='btn btn-icon'>
                    <EditIcon />
                </button>
            </div>
        </div>
    )
}

