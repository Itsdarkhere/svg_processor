'use client'
import Confirm from '@/components/Confirm';
import dynamic from 'next/dynamic';
import Download from '@/components/Download';
import InspectAdminMap from '@/components/InspectAdminMap';
import InspectFrontendMap from '@/components/InspectFrontendMap';
import Parser from '@/components/Parser';
import Screenshot from '@/components/Screenshot';
import SetHotspot from '@/components/SetHotspot';
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
const GLMap = dynamic(() => import('@/components/GLMap/GLMap'), {
  ssr: false
})
const inter = Inter({ subsets: ['latin']});

export default function Home() {
  const [step, setStep] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [imagesTaken, setImagesTaken] = useState(false);
  const [hotspotSet, setHotspotSet] = useState(false);
  const [images, setImages] = useState<any>([]);
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<Data>({
    sections: {},
    rows: {},
    seats: {},
  });

  useEffect(() => {
    console.log(Array.from(Object.keys(result.seats)).length);
  }, [result])

  const handleContinue = () => {
    const nextStep = step + 1;
    setStep(nextStep);
  };

  const stepClass = (index: number) => {
    return index <= step ? "step step-primary" : "step";
  };

  const isContinueDisabled = () => {
    switch (step) {
      case 0:
        return !uploaded;
      case 1:
        return !uploaded;
      case 2:
        return !uploaded;
      case 3:
        return !uploaded;
      case 4:
        return !hotspotSet;
      case 5:
        return !imagesTaken;
      default:
        return true;
    }
  }

  const continueText = () => {
    switch (step) {
      case 0:
        return "Continue";
      case 1:
        return "Looks good?";
      case 2:
        return "It works?";
      case 3:
        return "It works?";
      case 4:
        return "Continue";
      case 5:
        return "Finish";
      case 6:
        return "All done!";
      default:
        return "Continue";
    }
  }

  return (
    <main className={`flex flex-col justify-start items-center bg-neutral-950 `}>
      <div className='flex z-30  justify-center bg-neutral-800 items-center py-8 fixed top-0 left-0 right-0 w-full'>
        <ul className="steps">
          <li className={stepClass(0)}>Upload SVG</li>
          <li className={stepClass(1)}>Confirm</li>
          <li className={stepClass(2)}>Frontend</li>
          <li className={stepClass(3)}>Admin</li>
          <li className={stepClass(4)}>Set HOTSPOT</li>
          <li className={stepClass(5)}>Screenshot</li>
          <li className={stepClass(6)}>Download Files</li>
        </ul>
      </div>

      <div className='py-36 px-4 min-h-screen w-full flex justify-center items-center'>
        {step === 0 && <Parser setUploaded={setUploaded} setResult={setResult} setFileName={setFileName} />}
        {step === 1 && <Confirm result={result} />}
        {step === 2 && <InspectFrontendMap result={result} />}
        {step === 3 && <InspectAdminMap result={result} />}
        {step === 4 && <SetHotspot result={result} setResult={setResult} setHotspotSet={setHotspotSet} />}
        {step === 5 && <Screenshot result={result} images={images} setImages={setImages} imagesTaken={imagesTaken} setImagesTaken={setImagesTaken} />}
        {step === 6 && <Download result={result} images={images} filename={fileName} />}
      </div>

      <div className=' z-30 flex justify-end items-center fixed left-0 bottom-0 right-0 bg-neutral-800 py-6 px-10'>
        <button disabled={isContinueDisabled()} onClick={handleContinue} className="btn px-8 text-white btn-primary">{continueText()}</button>
      </div>
    </main>
  );
}


export interface Data {
  sections: { [key: string]: SectionData },
  rows: { [key: string]: RowData },
  seats: { [key: string]: SeatData },
}

export interface SectionData {
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

export interface RowData {
  rowId: string;
  sectionId: string,
  path: string | undefined;
  seats: string[];
  // ticket: Ticket;
}

export interface SeatData {
  cx: number;
  cy: number;
  w: number;
  h: number;
  selected: boolean;
  seatId: string;
  sectionId: string;
  rowId: string;
}

export interface Ticket {
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