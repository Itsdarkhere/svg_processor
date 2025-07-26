'use client'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useActions } from "../ActionsProvider2/ActionsProvider";
import Section from "./Section/Section";
// import map from "./map.svg"
export default function SeatMap({
    data,
    setData,
    background
}) {

    const { svgRef, setScale, zoomRef } = useActions();
    // If anything changes in the map, this triggers
    const transformed = (_, newScale) => {
        setScale(newScale.scale);
    };

    return (
        <TransformWrapper
            ref={zoomRef}
            initialScale={1}
            minScale={1}
            maxScale={10}
            doubleClick={{ disabled: true }}
            wheel={{ step: 0.2 }}
            panning={{ velocityDisabled: true }}
            onTransformed={transformed}
            centerOnInit={true}
        >
            <TransformComponent>
                <svg
                    ref={svgRef}
                    id='primary-svg'
                    data-component='svg'
                    aria-hidden='true'
                    viewBox={`0 0 3000 2250`} // Change to dynamic viewBox
                    className="map_svg"
                    style={{ backgroundImage: `url(${background})` }} // Change to dynamic svg
                >
                    <g className='polygons'>
                        {data && Object.values(data.sections).map((section) => (
                            <Section data={data} section={section} key={section.sectionId} />
                        ))}
                    </g>
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}