'use client' 
import Section from './Section/Section';
export default function Sections({ 
    data, 
    setData,
}) {

    return (
        <g className='polygons'>
            {data && Object.values(data.sections).map((section) => (
                <Section data={data} section={section} key={section.sectionId} />
            ))}
        </g>
    )
}