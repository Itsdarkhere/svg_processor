'use client'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useActions } from "../ActionsProvider/ActionsProvider";
import { Sections } from "./Sections";
// import map from "./map.svg"
export default function SeatMap({
    data,
    setData,
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
                    viewBox={`0 0 6088 7088`} // Change to dynamic viewBox
                    className="map_svg"
                    // style={{ backgroundImage: `url(${map})` }} // Change to dynamic svg
                >
                    <Sections
                        data={data}
                        setData={setData}
                    />
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}