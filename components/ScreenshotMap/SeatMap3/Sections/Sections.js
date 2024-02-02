import { useEffect, useState } from 'react';
import target from '../../../../public/target.svg';
export default function Sections({ 
    data, 
    activeMapAction,
    svgRef
}) {

    const getSectionFill = () => {
        if (true) {
            return "#E6DFF8";
        }
        return "#E6E8EC";
    }

    useEffect(() => {
        if (svgRef.current) {
            // Accessing all path-text elements by class name since IDs can be dynamic
            const pathTexts = svgRef.current.querySelectorAll('.path-text');

            pathTexts.forEach(pathText => {
                const bbox = pathText.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;

                // Create a text element
                const text = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                text.setAttribute("cx", centerX);
                text.setAttribute("cy", centerY);
                text.setAttribute("r", 100);
                text.setAttribute("fill", "#6531F5");

                // Append text to the SVG
                svgRef.current.appendChild(text);
            });
        }
    }, [data]);

    return (
        <g className='polygons'>
            {data?.sections && Object.values(data.sections).map((section, i) => {
                return (
                    <g key={section.sectionId}>
                        {/* Section, just used for the click to select all seats of a section */}
                        <path
                            fill={getSectionFill()}
                            filter={section?.filter}
                            d={section.path}
                            id={section.sectionId}
                            className={`path`}
                            strokeWidth={section?.strokeWidth}
                            stroke={"#6531F5"}
                        ></path>
                        <path d={section?.identifier?.path} className="path-text opacity-0" id={`path-text-${i}`} fill={'#B1B5C4'} opacity={1}></path>
                    </g>
                )
            })}
        </g>
    )
}
