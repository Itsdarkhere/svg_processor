'use client'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useActions } from "../ActionsProvider3/ActionsProvider";
import { Sections } from "./Sections";
import { Rows } from "./Rows";

export default function SeatMap({
    data,
    selectedIds,
}) {
    const { svgRef } = useActions();

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
                        selectedIds={selectedIds}
                    />
                    <Rows data={data} svgRef={svgRef} selectedIds={selectedIds} />
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}