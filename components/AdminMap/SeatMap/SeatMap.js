import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useActions } from "../ActionsProvider/ActionsProvider";
import { Sections } from "./Sections";
import { Seats } from "./Seats";

import map from "./map.svg"

export default function SeatMap({
    data,
    setData,
    activeTab,
}) {

    const { svgRef, setScale, zoomRef, activeMapAction } = useActions();
    // If anything changes in the map, this triggers
    const transformed = (_, newScale) => {
        setScale(newScale.scale);
    };

    // This decides if hover-effects are applied on each given seat
    const shouldSelectSeat = (seat, allAssigned) => {
        if (allAssigned) return true;

        if ((activeTab === 'scaling' && seat?.PLFill === undefined) ||
            (activeTab === 'inventory' && seat?.inventoryFill === undefined)) {
            return true;
        }

        return false;
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
                    style={{ backgroundImage: `url(${map})` }} // Change to dynamic svg
                >
                    <Seats
                        data={data}
                        setData={setData}
                        activeTab={activeTab}
                        shouldSelectSeat={shouldSelectSeat}
                        activeMapAction={activeMapAction}
                    />
                    <Sections
                        data={data}
                        setData={setData}
                        activeTab={activeTab}
                        shouldSelectSeat={shouldSelectSeat}
                        activeMapAction={activeMapAction}
                    />
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}