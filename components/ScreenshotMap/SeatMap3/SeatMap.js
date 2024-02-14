'use client'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useActions } from "../ActionsProvider3/ActionsProvider";
import { Sections } from "./Sections";
import { Seats } from "./Seats";

export default function SeatMap({
    data,
    activeTab,
    selectedIndex,
}) {
    const { svgRef, activeMapAction } = useActions();

    return (
        <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={10}
            doubleClick={{ disabled: true }}
            centerOnInit={true}
        >
            <TransformComponent>
                <svg
                    ref={svgRef}
                    id='primary-svg'
                    data-component='svg'
                    aria-hidden='true'
                    viewBox={`0 0 10240 7680`} // Change to dynamic viewBox
                    className="map_svg"
                >
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