import Student from "../model/Student";
import {useRef, useState} from "react";

const WHEEL_RADIUS = 500;


export type WheelProps = {
    students: Student[],
    rotation: number,
    getStudentPart: (student: Student) => number
}

export default function WheelComponent(props: WheelProps) {
    let angle = 0;
    return (
        <svg className='wheel' viewBox={'0 0 ' + (WHEEL_RADIUS * 2) + ' ' + (WHEEL_RADIUS * 2)}>
            <g className={'wheel-arcs ' + (props.rotation>0 ? 'rotating' : '')} style={{"--rotation": -props.rotation + 'deg'} as React.CSSProperties}>
                {props.students.map((student, index) =>
                    <WheelArc key={index} index={index}
                              text={getStudentName(student)}
                              startAngle={angle}
                              endAngle={angle=angle + 2 * Math.PI * props.getStudentPart(student) }/>
                )}
                {props.students.length === 0 ? <WheelArc index={0} startAngle={0} endAngle={2 * Math.PI}/> : null}
            </g>
            <path d={'M ' + WHEEL_RADIUS*0.95 + ' ' + 0
                + ' L ' + WHEEL_RADIUS + ' ' + WHEEL_RADIUS*0.1
                + ' L ' + WHEEL_RADIUS*1.05 + ' ' + 0
                + 'Z'} className="wheel-indicator" strokeWidth="5"/>

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