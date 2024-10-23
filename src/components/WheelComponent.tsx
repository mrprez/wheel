import Student from "../model/Student";
import {useEffect, useRef, useState} from "react";

const WHEEL_RADIUS = 500;


export type WheelProps = {
    students: Student[],
    rotation: number,
    getStudentPart: (student: Student) => number
}

export default function WheelComponent(props: WheelProps) {
    const [actualRotation, setActualRotation] = useState(0);
    const wheelArcsGroupRef = useRef<SVGGElement>(null);
    useEffect(() => {
        if (wheelArcsGroupRef.current) {
            const rotationKeyFrames = [
                { transform: "rotate(" + actualRotation + "deg)" },
                { transform: "rotate(" + props.rotation + "deg)" }
            ];
            const rotationTiming = {
                duration: props.rotation==0 ? 1000 : 10000,
                iterations: 1,
                fill: "forwards" as FillMode,
                easing: "cubic-bezier(0, 0, 0.1, 1)"
            };
            const rotationAnimation = wheelArcsGroupRef.current.animate(rotationKeyFrames, rotationTiming);
            rotationAnimation.finished.then(() => {
                setActualRotation(props.rotation);
            });
        }
    }, [props.rotation, actualRotation]);
    let angle = 0;
    return (
        <svg className='wheel' viewBox={'0 0 ' + (WHEEL_RADIUS * 2) + ' ' + (WHEEL_RADIUS * 2)}>
            <g className="wheel-arcs" ref={wheelArcsGroupRef}>
                {props.students.map((student, index) =>
                    <WheelArc key={index} index={index}
                              text={getStudentName(student)}
                              startAngle={angle}
                              endAngle={angle=angle + 2 * Math.PI * props.getStudentPart(student) }/>
                )}
                {props.students.length === 0 ? <WheelArc index={0} startAngle={0} endAngle={2 * Math.PI}/> : null}
            </g>
            <path d={'M ' + WHEEL_RADIUS*0.95 + ' ' + 3
                + ' L ' + WHEEL_RADIUS + ' ' + WHEEL_RADIUS*0.1
                + ' L ' + WHEEL_RADIUS*1.05 + ' ' + 3
                + 'Z'} className="wheel-indicator" strokeWidth="6"/>
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
    let style = "style-" + (props.index % 3);
    if (Math.abs(props.endAngle - Math.PI * 2) < 0.00001 && props.index % 3 === 0) {
        style = "style-1";
    }

    return (
        <g className={'wheel-arc-group ' + style}>
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