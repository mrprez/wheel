import StudentClass from '../model/StudentClass';
import { EditIcon } from './icons/EditIcon';

type ClassListProps = {
    list: StudentClass[],
    goToClassCallback: (studentClass: StudentClass) => void
}


export default function ClassListComponent({list, goToClassCallback}: ClassListProps) {
    return (
        <div className='list'>
            {list.map(studentClass => <ClassListItem key={studentClass.id} studentClass={studentClass} goToClassCallback={goToClassCallback}/>)}
        </div> 
    );
}


type ClassListItemProps = {
    key :number,
    studentClass: StudentClass,
    goToClassCallback: (studentClass: StudentClass) => void
};

function ClassListItem({studentClass, goToClassCallback} : ClassListItemProps) {
    return (
        <div className='item active' onClick={() => goToClassCallback(studentClass)}>
            <div className='item-content'>
                <span className='item-title'>{studentClass.name}</span>
            </div>
            <div className='actions'>
                <button className='btn btn-icon'>
                    <EditIcon />
                </button>
            </div>
        </div>
    )
}

