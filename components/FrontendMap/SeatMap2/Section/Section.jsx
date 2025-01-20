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


    console.log("FE SECTIONS: ", section)
    return (
        <g key={section.sectionId}>
            <path
                d={section.path}
                id={section.sectionId}
                strokeWidth={section?.strokeWidth}
                onClick={() => toggleSection(section)}
                stroke={section?.stroke}
                fill={selected ? '#3E8BF7' : section?.fill}
                className={`path`}
            >
            </path>
            {/* Visuals, probably text */}
            <path d={section?.identifier?.path} className="path-text" fill={selected ? '#FCFCFD' : section?.identifier?.fill} opacity={1}></path>
        </g>
    )
}