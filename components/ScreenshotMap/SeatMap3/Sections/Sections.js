import Section from './Section/Section';

export default function Sections({ 
    data, 
    svgRef,
    selectedIndex,
}) {

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
