'use client'
import React, { useEffect } from 'react'

export default function Row({ row, svgRef, i, selectedIds }) {

    useEffect(() => {
        const selected = selectedIds?.row === row?.rowId;
        const bigCircleId = `highlight-big-circle-${i}`;
        const smallCircleId = `highlight-small-circle-${i}`;
        if (selected) {
            // const selectedSection = svgRef.current.querySelector(`#${selectedIds.section}`);
            const pathTexts = svgRef.current.querySelectorAll(`#row-${i}`);

            pathTexts.forEach(pathText => {
                // const secBbox = selectedSection.getBBox();
                const rowBbox = pathText.getBBox();
                const centerX = rowBbox.x + rowBbox.width / 2;
                const centerY = rowBbox.y + rowBbox.height / 2;
                // const secWidth = secBbox.width * 0.6;
                // const secHeight = secBbox.height * 0.6;
                // const r = secHeight > secWidth ? secWidth : secHeight;
                // const adjustedR = r / 2;
                // const finalR = adjustedR < 100 ? 100 : adjustedR;

                // Create a circle element
                // Create the big circle
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
    }, [selectedIds]);

    if (!row?.path) return null;
    return (
        <path
            d={row.path}
            fill='transparent'
            id={`row-${i}`}
        />
    )
}