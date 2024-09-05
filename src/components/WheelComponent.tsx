import Student from "../model/Student";
import {useRef, useState} from "react";

const WHEEL_RADIUS = 500;


export type WheelProps = {
    students: Student[],
    drawCallback: (student: Student) => void
}

export default function WheelComponent(props: WheelProps) {
    const weightSum = props.students.reduce((sum, student) => sum + getStudentWeigth(student), 0);
    const [rotation, setRotation] = useState<number|null>(null);

    const wheelArcsRef = useRef<SVGGElement>(null);
    const wheelRotation = () => {
        if (wheelArcsRef.current) {
            if (! rotation) {
                const random = Math.random() * weightSum;
                const drawnStudent = getDrawnStudent(props.students, random);
                const rotation = Math.floor((3.25 + random / weightSum) * 360);
                setRotation(rotation);
                wheelArcsRef.current.style.setProperty('--rotation', -rotation + 'deg');
                wheelArcsRef.current.classList.add('rotating');
                props.drawCallback(drawnStudent);
            }
        }
    }

    let angle = 0;
    return (
        <div className="wheel-ctn">
            <svg className='wheel' viewBox={'0 0 ' + (WHEEL_RADIUS * 2) + ' ' + (WHEEL_RADIUS * 2)}>
                <g className="wheel-arcs" ref={wheelArcsRef}>
                    {props.students.map((student, index) =>
                        <WheelArc key={index} index={index}
                                  text={getStudentName(student)}
                                  startAngle={angle}
                                  endAngle={angle=angle + 2 * Math.PI * getStudentWeigth(student) / weightSum }/>
                    )}
                    {props.students.length === 0 ? <WheelArc index={0} startAngle={0} endAngle={2 * Math.PI}/> : null}
                </g>
            </svg>
            <div className="wheel-btn-ctn">
                <button className="btn large" onClick={wheelRotation}>Lancer</button>
            </div>
        </div>
    );
}

function getStudentName(student: Student): string {
    if (student.lastname.length === 0) {
        return student.firstname;
    }
    return student.firstname + ' ' + student.lastname.substring(0, 1) + '.';
}

function getStudentWeigth(student: Student): number {
    return 1 / Math.pow(2, student.drawCount);
}

function getDrawnStudent(studentList: Student[], random: number): Student {
    let sum = 0;
    for (const student of studentList) {
        sum += getStudentWeigth(student);
        if (sum >= random) {
            return student;
        }
    }
    throw new Error('No student found');
}

type WheelArcProps = {
    index: number,
    startAngle: number,
    endAngle: number,
    text?: string
}

function WheelArc(props :WheelArcProps) {
    const defs = (
        <defs>
            <path id={'text-' + props.index}
                  d={describeTextPath(WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_RADIUS, props.startAngle, props.endAngle)}/>
        </defs>
    );
    const arc = <path d={describeArc(WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_RADIUS * 0.99, props.startAngle, props.endAngle)} className="wheel-arc"/>
    const text = props.text ? (
        <text fontSize="25" className="wheel-arc-text">
            <textPath href={'#text-' + props.index}>{props.text}</textPath>
        </text>
    ) : null;

    return (
        <g className="wheel-arc-group">
            {defs}
            {arc}
            {text}
        </g>
    );
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
    let path = "M " + cx + " " + cy + " ";
    path = path  + "L " + (cx + radius * Math.cos(startAngle)) + " " + (cy + radius * Math.sin(startAngle)) + " ";
    let angle = startAngle;
    while (angle < endAngle) {
        angle = Math.min(angle + Math.PI / 2, endAngle);
        path = path + "A " + radius + " " + radius + " 0 0 1 " + (cx + radius * Math.cos(angle)) + " " + (cy + radius * Math.sin(angle)) + " ";
    }
    path = path + "Z";
    return path;
}

function describeTextPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
    const angle = (startAngle + endAngle) / 2;
    const startRadius = radius * 0.9;
    const endRadius = radius * 0.1;
    return "M " + (cx + startRadius * Math.cos(angle)) + " " + (cy + startRadius * Math.sin(angle)) + " "
        + "L " + (cx + endRadius * Math.cos(angle)) + " " + (cy + endRadius * Math.sin(angle));
}