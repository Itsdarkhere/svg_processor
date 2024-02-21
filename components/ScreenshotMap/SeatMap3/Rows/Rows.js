import { Row } from './Row';
export default function Rows({ 
    data,
    svgRef,
    selectedIds,
}) {

    return (
        <g className='seats'>
            {data?.rows && Object.values(data.rows).map((row, i) => (
                <g key={row.rowId}>
                    <Row row={row} svgRef={svgRef} key={i} i={i} selectedIds={selectedIds} />
                </g>
            ))}
        </g>
    )
}