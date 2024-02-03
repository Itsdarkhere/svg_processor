'use client'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useActions } from "../ActionsProvider3/ActionsProvider";
import { Sections } from "./Sections";
import { Seats } from "./Seats";
import map from "./map.svg"
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

export default function SeatMap({
    data,
    activeTab,
}) {
    const { svgRef, setScale, zoomRef, activeMapAction } = useActions();

    // If anything changes in the map, this triggers
    const transformed = (_, newScale) => {
        setScale(newScale.scale);
    };

    const dwnld = () => {
        console.log("download")
        htmlToImage.toPng(document.getElementById('mappp'))
        .then(function (dataUrl) {
            download(dataUrl, 'mappic.png');
        });
    }

    const download = (image, { name = "img", extension = "jpg" } = {}) => {
        const a = document.createElement("a");
        a.href = image;
        a.download = createFileName(extension, name);
        a.click();
    };

    const createFileName = (extension = "", ...names) => {
        if (!extension) {
          return "";
        }
      
        return `${names.join("")}.${extension}`;
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
                <button className=" btn absolute -top-20" onClick={dwnld}>CLICK</button>
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
                        activeTab={activeTab}
                        activeMapAction={activeMapAction}
                    />
                    <Sections
                        data={data}
                        activeMapAction={activeMapAction}
                        svgRef={svgRef}
                    />
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}