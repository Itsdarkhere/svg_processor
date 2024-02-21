'use client'
import { useEffect } from "react";

export default function Section({ section, i, selected, svgRef }) {
    
    useEffect(() => {
        const bigCircleId = `highlight-bigg-circle-${i}`;
        const smallCircleId = `highlight-smalll-circle-${i}`;
        if (selected && !section?.zoomable) {
            const pathTexts = svgRef.current.querySelectorAll(`#path-text-${i}`);

            pathTexts.forEach(pathText => {
                const bbox = pathText.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;

                // Create a circle element
                const bigCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                bigCircle.setAttribute("cx", centerX);
                bigCircle.setAttribute("cy", centerY);
                bigCircle.setAttribute("r", 200);
                bigCircle.setAttribute("fill", "#6531F5");
                bigCircle.setAttribute("id", bigCircleId);

                // Create the small circle
                const smallCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                smallCircle.setAttribute("cx", centerX);
                smallCircle.setAttribute("cy", centerY);
                smallCircle.setAttribute("r", 125);
                smallCircle.setAttribute("fill", "white");
                smallCircle.setAttribute("id", smallCircleId);

                // Append circles to the SVG
                svgRef.current.appendChild(bigCircle);
                svgRef.current.appendChild(smallCircle);
            });
        } else {
            const existingBigCircle = svgRef.current.querySelector(`#${bigCircleId}`);
            const existingSmallCircle = svgRef.current.querySelector(`#${smallCircleId}`);
            if (existingBigCircle) {
                svgRef.current.removeChild(existingBigCircle);
            }
            if (existingSmallCircle) {
                svgRef.current.removeChild(existingSmallCircle);
            }
        }
    }, [selected]);

    return (
        <g key={section.sectionId}>
            <path
                fill={selected ? section.fill : "#E6E8EC"}
                filter={section?.filter}
                d={section.path}
                id={section.sectionId}
                className={`path`}
                strokeWidth={section?.strokeWidth}
                stroke={selected ? section?.stroke : "#E6E8EC"}
            ></path>
            <path d={section?.identifier?.path} className="path-text" id={`path-text-${i}`} fill={section?.identifier?.fill} opacity={0}></path>
        </g>
    )
}