
export type ListItemProps = {
    key: number,
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
                <ListItem {...item}/>
            )}
        </div>
    );
}


function ListItem(props :ListItemProps) {
    const itemClassName = props.onClickCallback ? 'item active' : 'item';
    return (
        <div className={itemClassName} onClick={props.onClickCallback} id={String(props.key)}>
            <div className='item-content'>
                <span className='item-title'>{props.title}</span>
            </div>
            <div className='actions'>
            </div>
        </div>
    )
}