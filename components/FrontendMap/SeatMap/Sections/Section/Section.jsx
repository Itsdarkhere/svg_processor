'use client'
import { useState } from "react"

export default function Section({ section, data}) {
    const [selected, setSelected] = useState(false)

    const toggleSection = (section) => {
        console.log('section', section);
        const updatedSections = { ...data.sections };
        if (updatedSections.hasOwnProperty(section.sectionId)) {
           setSelected(!selected);
        }
    };


    return (
        <g key={section.sectionId}>
            <path
                d={section.path}
                id={section.sectionId}
                strokeWidth={section?.strokeWidth}
                onClick={() => toggleSection(section)}
                fill={selected ? '#3E8BF7' : '#E6E8EC'} stroke={selected ? '#3E8BF7' : '#B1B5C4'}
                className={`path`}
            >
            </path>
            {/* Visuals, probably text */}
            <path d={section?.identifier?.path} className="path-text" fill={selected ? '#FCFCFD' : '#B1B5C4'} opacity={1}></path>
        </g>
    )
}