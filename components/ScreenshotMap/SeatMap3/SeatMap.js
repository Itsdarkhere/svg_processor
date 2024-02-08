'use client'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useActions } from "../ActionsProvider3/ActionsProvider";
import { Sections } from "./Sections";
import { Seats } from "./Seats";
import map from "./map.svg"

export default function SeatMap({
    data,
    activeTab,
    selectedIndex,
}) {
    const { svgRef, setScale, zoomRef, activeMapAction } = useActions();

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
                    viewBox={`0 0 30086 20086`} // Change to dynamic viewBox
                    className="map_svg"
                    // style={{ backgroundImage: `url(${map})` }} // Change to dynamic svg
                >
                    <Seats
                        data={data}
                        activeTab={activeTab}
                        activeMapAction={activeMapAction}
                    />
                    <Sections
                        data={data}
                        svgRef={svgRef}
                        selectedIndex={selectedIndex}
                    />
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}