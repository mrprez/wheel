import Student from "../model/Student";

const WHEEL_RADIUS = 500;

export type WheelProps = {
    students: Student[],
}



export default function WheelComponent(props: WheelProps) {
    const weightSum = props.students.length;
    let angle = 0;
    return (
        <svg className='wheel' viewBox={'0 0 '+(WHEEL_RADIUS*2)+' '+(WHEEL_RADIUS*2)}>
            {props.students.map((student, index) =>
                <WheelArc key={index} index={index}
                          text={getStudentName(student)}
                          startAngle={angle}
                          endAngle={angle=angle + 2 * Math.PI * 1 / weightSum }/>
            )}
        </svg>
    );
}

function getStudentName(student: Student): string {
    if (student.lastname.length === 0) {
        return student.firstname;
    }
    return student.firstname + ' ' + student.lastname.substring(0, 1) + '.';
}

type WheelArcProps = {
    index: number,
    startAngle: number,
    endAngle: number,
    text: string
}

function WheelArc(props :WheelArcProps) {
    return (
        <g className="wheel-arc-group">
            <defs>
                <path id={'text-'+props.index} d={describeTextPath(WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_RADIUS, props.startAngle, props.endAngle)}/>
            </defs>
            <path d={describeArc(WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_RADIUS * 0.99, props.startAngle, props.endAngle)} className="wheel-arc"/>
            <text font-size="25" className="wheel-arc-text">
                <textPath href={'#text-'+props.index}>{props.text}</textPath>
            </text>
        </g>
);
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
    const a = endAngle - startAngle >= Math.PI ? 1 : 0;
    return "M " + cx + " " + cy + " "
        + "L " + (cx + radius * Math.cos(startAngle)) + " " + (cy + radius * Math.sin(startAngle)) + " "
        + "A " + radius + " " + radius + " 0 " + a + " 1 " + (cx + radius * Math.cos(endAngle)) + " " + (cy + radius * Math.sin(endAngle)) + " "
        + "Z";
}

function describeTextPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
    const angle = (startAngle + endAngle) / 2;
    const startRadius = radius * 0.1;
    const endRadius = radius * 0.9;
    return "M " + (cx + startRadius * Math.cos(angle)) + " " + (cy + startRadius * Math.sin(angle)) + " "
        + "L " + (cx + endRadius * Math.cos(angle)) + " " + (cy + endRadius * Math.sin(angle));
}