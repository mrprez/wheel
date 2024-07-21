import StudentClass from '../model/StudentClass';

type ClassListProps = {
    list: StudentClass[],
    goToClassCallback: (studentClass: StudentClass) => void
}


export default function ClassListComponent({list, goToClassCallback}: ClassListProps) {
    return (
        <div>
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
        <div onClick={() => goToClassCallback(studentClass)}>{studentClass.name}</div>
    )
}

