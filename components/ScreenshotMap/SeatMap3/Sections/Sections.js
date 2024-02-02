import target from '../../../../public/target.svg';
export default function Sections({ 
    data, 
    activeMapAction,
}) {

    const getSectionFill = () => {
        if (false) {
            return "#E6DFF8";
        }
        return "#E6E8EC";
    }

    return (
        <g className='polygons'>
            {data?.sections && Object.values(data.sections).map((section) => {
                return (
                    <g key={section.sectionId}>
                        {/* Section, just used for the click to select all seats of a section */}
                        <path
                            fill={getSectionFill()}
                            filter={section?.filter}
                            d={section.path}
                            id={section.sectionId}
                            className={`path`}
                            // strokeWidth={section?.strokeWidth}
                            // stroke={"#6531F5"}
                        ></path>
                        <path d={section?.identifier?.path} className="path-text" fill={'#B1B5C4'} opacity={1}></path>
                    </g>
                )
            })}
        </g>
    )
}

function GASection({ 
    getSectionFill, 
    section, 
    activeMapAction, 
}) {

    return (
        <g>
            {/* Section */}
            <path
                fill={getSectionFill()}
                d={section.path}
                className={`path`}
                style={{
                    pointerEvents: activeMapAction === 4 ? "none" : "all",
                }}
                filter={section?.filter}
                id={section.sectionId}
            ></path>
            {/* Visuals, probably text */}
            {/* <path d={section?.identifier?.path} className="path-text" fill={'#B1B5C4'} opacity={1}></path> */}
        </g>
    )
}