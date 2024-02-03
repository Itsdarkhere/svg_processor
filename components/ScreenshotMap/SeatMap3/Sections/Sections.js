import { useEffect, useState } from 'react';
import Section from './Section/Section';
export default function Sections({ 
    data, 
    activeMapAction,
    svgRef
}) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        if (!data?.sections || Object.keys(data.sections).length === 0) return;

        const maxIndex = Object.keys(data.sections).length -1;
        const interval = setInterval(() => {
            setSelectedIndex((prevIndex) => {
                if (prevIndex >= maxIndex) {
                    clearInterval(interval);
                    return -1;
                } else {
                    return prevIndex + 1;
                }
            });
        }, 2000)

        return () => clearInterval(interval);
    }, [data])

    return (
        <g className='polygons'>
            {data?.sections && Object.values(data.sections).map((section, i) => {
                return (
                    <Section section={section} i={i} key={i} selected={i === selectedIndex} svgRef={svgRef} />
                )
            })}
        </g>
    )
}
