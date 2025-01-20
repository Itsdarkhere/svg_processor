import { Data } from "@/app/page";


export default function Confirm({ result }: { result: Data}) {

    const getFoundSections = () => {
        return (
          Object.values(result.sections).map((sectionData, i) => {
            let totalSeats = 0;
            return (
              <div key={i} className="  w-full p-3 bg-zinc-600 mt-5 rounded-lg">
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

    return (
        <div className=" w-full max-w-5xl flex flex-col justify-center items-center">
            <div className="w-full mt-6 p-5 bg-zinc-400 rounded-lg text-xl">
                JSON condensed information
                <p className=" text-sm">Should have correct amount of sections, rows, seats, the right colors etc </p>
            </div>
            {getFoundSections()}
            <div className="w-full mt-6 p-5 bg-zinc-400 rounded-lg text-xl">
                JSON entire result
                <p className=" text-sm">If theres something weird in the &quot;condensed information&quot; you can have a closer look here</p>
            </div>
            <pre className=" w-full p-3 bg-zinc-600 mt-5 rounded-lg max-h-96 overflow-scroll text-ellipsis">{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}