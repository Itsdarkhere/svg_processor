import { useEffect } from "react";

export default function Section({ section, i, selected, svgRef }) {

    useEffect(() => {
        const circleId = `highlight-circle-${i}`;
        if (selected) {
            const pathTexts = svgRef.current.querySelectorAll(`#path-text-${i}`);

            pathTexts.forEach(pathText => {
                const bbox = pathText.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;

                // Create a circle element
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", centerX);
                circle.setAttribute("cy", centerY);
                circle.setAttribute("r", 100);
                circle.setAttribute("fill", "#6531F5");
                circle.setAttribute("id", circleId);

                // Append circle to the SVG
                svgRef.current.appendChild(circle);
            });
        } else {
            const existingCircle = svgRef.current.querySelector(`#${circleId}`);
            if (existingCircle) {
                svgRef.current.removeChild(existingCircle);
            }
        }
    }, [selected]);

    return (
        <g key={section.sectionId}>
            <path
                fill={selected ? "#E6DFF8" : "#E6E8EC"}
                filter={section?.filter}
                d={section.path}
                id={section.sectionId}
                className={`path`}
                strokeWidth={section?.strokeWidth}
                stroke={selected ? "#6531F5" : "#E6E8EC"}
            ></path>
            <path d={section?.identifier?.path} className="path-text" id={`path-text-${i}`} fill={'#B1B5C4'} opacity={0}></path>
        </g>
    )
}