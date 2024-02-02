'use client'
import { useState } from "react"

interface Data {
    sections: { [key: string]: SectionData },
    rows: { [key: string]: RowData },
    seats: { [key: string]: SeatData },
  }
  
  interface SectionData {
    sectionId: string | undefined,
    path: string | null;
    zoomable: boolean;
    fill: string | null,
    stroke: string | null,
    strokeWidth: string | null,
    identifier: {
      path: string | null;
      fill: string | null;
      opacity: string | null;
    },
    // ticket: Ticket | null;
    rows: string[];
  }
  
  interface RowData {
    rowId: string;
    sectionId: string,
    path: string | undefined;
    seats: string[];
    // ticket: Ticket;
  }
  
  interface SeatData {
    cx: number;
    cy: number;
    w: number;
    h: number;
    selected: boolean;
    seatId: string;
    sectionId: string;
    rowId: string;
  }
  
  interface Ticket {
      availableCount: number;
      cost: number;
      description: string;
      eventId: string;
      fee: number;
      generalAdmission: boolean;
      hide_description: boolean;
      hide_sale_dates: boolean;
      id: string | undefined;
      isActive: boolean;
      locked: null;
      maximum_quantity: number;
      minimum_quantity: number;
      name: string;
      on_sale_status: string;
      pricing: {
        feesWithoutTax: number;
        listing: boolean;
        paymentProcessingFee: number;
        serviceFees: number;
        taxPerTicket: number;
        ticketCost: number;
        ticketCostWithFees: number;
        ticketCostWithFeesAndTax: number;
        ticketFacilityFee: number;
        ticketName: string;
        ticketType: string;
        totalFees: number;
      };
      resale: boolean;
      royalty: number;
      sales_end: string;
      sales_start: string;
      slug: null;
      ticketGroup: string;
      uuid: string;
  }

export default function Parser() {
    const [result, setResult] = useState<Data>({
        sections: {},
        rows: {},
        seats: {},
      });
    
      const [fileName, setFileName] = useState<string>();
    
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = (e: ProgressEvent<FileReader>) => {
            console.log("onload");
            const svgString = e.target?.result as string;
            const parsedData = parseSVG(svgString);
            setRowArea(parsedData);
    
            // Get the file name without the ".svg" extension
            const fileName = file.name;
            const svgNameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.svg'));
            setFileName(svgNameWithoutExtension);
          }
        }
      }
    
      const parseSVG = (svgString: string) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const sections = svgDoc.querySelectorAll('g[id^="Sec-"]');
    
        let uniqueRowNumber = 0;
        const sectionData: { [key: string]: SectionData } = {};
        const rowData: { [key: string]: RowData } = {};
        const seatData: { [key: string]: SeatData } = {};
    
        sections.forEach((section) => {
          let combinedData = undefined;
          const sectionInfo = parseSection(section);
          if (sectionInfo.isZoomable) {
            if (sectionInfo.rows.length > 0) {
              const rowsData = parseRows(sectionInfo, uniqueRowNumber);
              uniqueRowNumber += rowsData.newUniqueRowNumber;
              // Assign
              Object.assign(rowData, rowsData.rowData);
              Object.assign(seatData, rowsData.seatData);
            } else {
              uniqueRowNumber++;
              // If no rows are found, look for direct seats
              combinedData = parseSeatsWithVirtualRowData(uniqueRowNumber, sectionInfo.seats, sectionInfo);
              // Assign
              Object.assign(seatData, combinedData.seatData);
              rowData[combinedData.virtualRowData.rowId] = combinedData.virtualRowData;
            }
          }
    
          let sectionRowsArray = [];
    
          if (combinedData?.virtualRowData?.rowId) {
            sectionRowsArray.push(combinedData.virtualRowData.rowId);
          } else {
            sectionRowsArray = Object.keys(sectionInfo.rows);
          }
    
          sectionData[sectionInfo.sectionNumber!] = generateSectionData(sectionInfo, sectionRowsArray);
        });
      
        return { sections: sectionData, rows: rowData, seats: seatData };
      }
    
      const parseSection = (section: Element) => {
        const sectionNumber = section.getAttribute('id')?.split('-')[1];
        const zoomable = section.getAttribute('class');
    
        const sectionP = section.querySelector('path');
        const fill = sectionP?.getAttribute('fill');
        const stroke = sectionP?.getAttribute('stroke');
        const strokeWidth = sectionP?.getAttribute('stroke-width');
    
        // Check if section is zoomable, if yes then we need seats etc, otherwise we dont
        // In that case we add ticket directly to section
        let isZoomable = false;
        let sectionTicket = null;
        if (zoomable === 'YZ') {
          isZoomable = true;
        } else {
          // sectionTicket = createTicket(sectionNumber!, `Section ${sectionNumber}`);
        }
    
        const sectionPath = section.querySelector('path')?.getAttribute('d') || null;
        const rows = section.querySelectorAll(`g[id^="sec-${sectionNumber}-row-"]`);
        // If no rows find seats directly
        let seats = undefined;
        if (rows.length === 0) {
          seats = section.querySelectorAll(`rect[id^="sec-${sectionNumber}-seat-"]`);
        }
    
        // Identifier is like the text above a section
        const identifier = section.querySelector(`g[id^="identifier"]`);
        const identifierText = identifier?.querySelector('path');
        const identifierTextPath = identifierText?.getAttribute('d') || null;
        const identifierTextFill = identifierText?.getAttribute('fill') || null;
        const identifierTextOpacity = identifierText?.getAttribute('fill-opacity') || null;
    
        return {
          sectionNumber,
          zoomable,
          fill,
          stroke,
          strokeWidth,
          isZoomable,
          sectionPath,
          rows,
          seats,
          // ticket: sectionTicket,
          identifierTextPath,
          identifierTextFill,
          identifierTextOpacity,
        }
      }
    
      const parseSeat = (seat: Element) => {
        const cx = parseFloat(seat.getAttribute('x') || '0');
        const cy = parseFloat(seat.getAttribute('y') || '0');
        const w = parseFloat(seat.getAttribute('width') || '0');
        const h = parseFloat(seat.getAttribute('height') || '0');
    
        return {
          cx,
          cy,
          w,
          h,
        }
      }
    
      const createTicket = (id: string, ticketName: string) => {
        return {
          availableCount: 12,
          cost: 60,
          description: 'VJX IS SEXY',
          eventId: '6c109ea3-23c2-4fa9-82ce-79346043a9a0',
          fee: 2,
          generalAdmission: true,
          hide_description: false,
          hide_sale_dates: false,
          id,
          isActive: true,
          locked: null,
          maximum_quantity: 3,
          minimum_quantity: 1,
          name: '',
          on_sale_status: 'available',
          pricing: {
            feesWithoutTax: 5.3,
            listing: false,
            paymentProcessingFee: 3.3,
            serviceFees: 0,
            taxPerTicket: 5.52,
            ticketCost: 60,
            ticketCostWithFees: 62,
            ticketCostWithFeesAndTax: 70.82,
            ticketFacilityFee: 2,
            ticketName,
            ticketType: 'Standard Ticket',
            totalFees: 10.82,
          },
          resale: false,
          royalty: 5,
          sales_end: '2023-04-09T02:00:00.000Z',
          sales_start: '2023-01-12T15:30:00.000Z',
          slug: null,
          ticketGroup: 'b9261819-a184-4a95-a22d-337df5154',
          uuid: 'b9261819-a184-4a95-a22d-337df5154'
        }
      }
    
      const parseRows = (sectionInfo: any, uniqueRowNumber: number) => {
        const sectionRows: string[] = [];
        const rowData: { [key: string]: RowData } = {};
        const seatData: { [key: string]: SeatData } = {};
      
        sectionInfo.rows.forEach((row: any) => {
          uniqueRowNumber++;
          const rowId = `${uniqueRowNumber}`;
          sectionRows.push(rowId);
          const seatsData = parseSeats(row, sectionInfo, uniqueRowNumber);
          // const ticket = createTicket(rowId, `Section ${sectionInfo.sectionNumber} Row ${rowId}`);
          rowData[rowId] = { rowId, sectionId: sectionInfo.sectionNumber!, seats: seatsData.seatIds, path: undefined };
          Object.assign(seatData, seatsData.seatData);
        });
      
        return { rowData, seatData, newUniqueRowNumber: uniqueRowNumber };
      };
    
      const parseSeatsWithVirtualRowData = (uniqueRowNumber: number,seats: any, sectionInfo: any) => {
        const seatData: { [key: string]: SeatData } = {};
        const rowId = uniqueRowNumber.toString();
    
        seats.forEach((seat: any) => {
            let id = seat.getAttribute('id');
            if (id) {
                id = id.replace(/(sec-\d+)-/, `$1-row-${rowId}-`);
                const seatInfo = parseSeat(seat);
                seatData[id] = { 
                  cx: seatInfo.cx, 
                  cy: seatInfo.cy, 
                  w: seatInfo.w, 
                  h: seatInfo.h, 
                  selected: false, 
                  seatId: id, 
                  sectionId: sectionInfo.sectionNumber!,
                  rowId: rowId  // Assigning the rowId
                };
            }
        });
    
        // const ticket = createTicket(rowId, `Section ${sectionInfo.sectionNumber} Row ${rowId}`);
        const virtualRowData = {
            rowId,
            sectionId: sectionInfo.sectionNumber!,
            seats: Object.keys(seatData),
            // ticket,
            path: undefined // No specific path for the virtual row
        };
    
        return { seatData, virtualRowData };
      };
    
      const parseSeats = (row: Element, sectionInfo: any, uniqueRowNumber: number) => {
        const rowNumber = row.getAttribute('id')?.split('-')[3];
        const seats = row.querySelectorAll(`rect[id^="sec-${sectionInfo.sectionNumber}-row-${rowNumber}-seat-"]`);
        
        const seatData: { [key: string]: SeatData } = {};
        const seatIds: string[] = [];
      
        seats.forEach((seat) => {
          const id = seat.getAttribute('id');
          if (id) {
            const seatInfo = parseSeat(seat);
            seatData[id] = { cx: seatInfo.cx, cy: seatInfo.cy, w: seatInfo.w, h: seatInfo.h, selected: false, seatId: id, sectionId: sectionInfo.sectionNumber!, rowId: uniqueRowNumber.toString()! };
            seatIds.push(id);
          }
        });
      
        return { seatData, seatIds };
      };
    
      const generateSectionData = (sectionInfo: any, rows: string[]) => {
        console.log("GENERATESECTIONDATA")
        return {
          sectionId: sectionInfo.sectionNumber,
          path: sectionInfo.sectionPath,
          rows: rows,
          zoomable: sectionInfo.isZoomable,
          // ticket: sectionInfo.ticket,
          fill: sectionInfo.fill,
          stroke: sectionInfo.stroke,
          strokeWidth: sectionInfo.strokeWidth,
          identifier: {
            path: sectionInfo.identifierTextPath,
            fill: sectionInfo.identifierTextFill,
            opacity: sectionInfo.identifierTextOpacity,
          }
        };
      };
    
      const setRowArea = (data: Data) => {
        let updatedData = { ...data };
    
        Object.values(updatedData.rows).forEach((row) => {
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
    
            row.seats.forEach((seatId: string) => {
                let seat = updatedData.seats[seatId];
                minX = Math.min(minX, seat.cx);
                minY = Math.min(minY, seat.cy);
                maxX = Math.max(maxX, seat.cx + seat.w);
                maxY = Math.max(maxY, seat.cy + seat.h);
            });
    
            const widthBuffer = Math.max(...row.seats.map(id => updatedData.seats[id].w));
            const heightBuffer = Math.max(...row.seats.map(id => updatedData.seats[id].h));
    
            minX -= widthBuffer / 2;
            maxX += widthBuffer / 2;
            minY -= heightBuffer / 2;
            maxY += heightBuffer / 2;
    
            let pathData = `M ${minX} ${minY} L ${maxX} ${minY} L ${maxX} ${maxY} L ${minX} ${maxY} Z`;
    
            // Store the path in the row
            row.path = pathData;
        });
    
        setResult(updatedData);
      };
    
      const getFoundSections = () => {
        return (
          Object.values(result.sections).map((sectionData, i) => {
            let totalSeats = 0;
            if (sectionData.rows.length !== 0) {
              // totalSeats = sectionData.rows.reduce((acc, rowId) => {
              //   const row = result.rows[rowId];
              //   return acc + row.seats.length;
              // }, 0);
            }
            return (
              <div key={i} className="">
                <p>SectionId: {sectionData.sectionId}</p>
                <p>Section fill color: {sectionData.fill}</p>
                <p>Section rows length: {sectionData.rows.length}</p>
                <p>Is section zoomable: {JSON.stringify(sectionData.zoomable)}</p>
                <p>Total seats in section: {totalSeats}</p>
              </div>
            )
          })
        )
      }
    
      const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${fileName}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }

    return (
        <div className="">
            <p>Choose an SVG</p>
            <input
            type="file"
            name="svgFile"
            id="svgFile"
            accept=".svg"
            onChange={handleChange}
            />
            {Object.keys(result.sections).length > 0 && <button className="" onClick={downloadJSON}>Download result</button>}
            <div className="">
            JSON condensed information
            <p className="">Should have correct amount of sections, rows, seats, the right colors etc </p>
            </div>
            {getFoundSections()}
            <div className="">
            JSON entire result
            <p className="">If theres something weird in the &quot;condensed information&quot; you can have a closer look here</p>
            </div>
            <pre className="">{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}