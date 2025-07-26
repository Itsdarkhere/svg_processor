"use client";
import { Data } from "@/app/page";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AddGASeats({
  result,
  setResult,
}: {
  result: Data;
  setResult: Dispatch<SetStateAction<Data>>;
}) {

  // State to track seat counts for each zoomable section
  const [seatCounts, setSeatCounts] = useState<{ [key: string]: number }>({});
  
  // State to track section names
  const [sectionNames, setSectionNames] = useState<{ [key: string]: string }>({});
  
  // State for save confirmation
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize seat counts and section names when result changes
  useEffect(() => {
    if (result?.sections) {
      const initialCounts: { [key: string]: number } = {};
      const initialNames: { [key: string]: string } = {};
      
      Object.entries(result.sections).forEach(([sectionKey, section]) => {
        if (!section.zoomable) {
          initialCounts[sectionKey] = 0;
          initialNames[sectionKey] = section.sectionName || '';
        }
      });
      
      setSeatCounts(initialCounts);
      setSectionNames(initialNames);
    }
  }, [result]);

  // Handle input change for seat count
  const handleSeatCountChange = (sectionKey: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setSeatCounts(prev => ({
      ...prev,
      [sectionKey]: numValue
    }));
  };

  // Handle section name change
  const handleSectionNameChange = (sectionKey: string, value: string) => {
    setSectionNames(prev => ({
      ...prev,
      [sectionKey]: value
    }));
  };

  // Check if form is valid for saving
  const isFormValid = () => {
    const sectionKeys = Object.keys(seatCounts);
    
    // Check if all sections have positive seat counts
    const allHaveSeats = sectionKeys.every(key => seatCounts[key] > 0);
    
    // Check if all section names are non-empty
    const allHaveNames = sectionKeys.every(key => 
      sectionNames[key] && sectionNames[key].trim() !== ''
    );
    
    return allHaveSeats && allHaveNames && sectionKeys.length > 0;
  };

  // Handle save - generate UUIDs and add to section.spots
  const handleSave = () => {
    if (!result?.sections || !isFormValid()) return;

    const updatedSections = { ...result.sections };

    Object.entries(seatCounts).forEach(([sectionKey, count]) => {
      if (count > 0 && updatedSections[sectionKey]) {
        // Generate UUIDs for the specified number of seats
        const newUUIDs = Array.from({ length: count }, () => uuidv4());
        
        // Add to existing spots or create new spots array
        const existingSpots = (updatedSections[sectionKey] as any).spots || [];
        
        updatedSections[sectionKey] = {
          ...updatedSections[sectionKey],
          spots: [...existingSpots, ...newUUIDs],
          sectionName: sectionNames[sectionKey].trim(),
          sectionNumber: sectionNames[sectionKey].trim(),
        };
      }
    });

    // Update the result with modified sections
    setResult(prev => ({
      ...prev,
      sections: updatedSections
    }));

    // Reset seat counts and show success message
    setSeatCounts(prev => {
      const reset: { [key: string]: number } = {};
      Object.keys(prev).forEach(key => {
        reset[key] = 0;
      });
      return reset;
    });

    // Show success confirmation
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3 seconds

    console.log("GA seat UUIDs added successfully!");
  };

  // Get zoomable sections
  const zoomableSections = Object.entries(result?.sections || {}).filter(
    ([, section]) => !section.zoomable
  );

  return (
    <div className='max-w-5xl flex flex-col gap-8 justify-center items-center'>
      <h2 className="text-2xl font-bold">Add GA Seats</h2>
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> GA seats have been added successfully.</span>
        </div>
      )}
      
      {zoomableSections.length > 0 ? (
        <div className="w-full space-y-4">
          {zoomableSections.map(([sectionKey, section]) => {
            const hasNameError = sectionNames[sectionKey] && sectionNames[sectionKey].trim() === '';
            const hasSeatError = seatCounts[sectionKey] <= 0;
            
            return (
              <div key={sectionKey} className="p-4 border rounded-lg space-y-3">
                {/* Section Name Input */}
                <div className="flex items-center gap-4">
                  <label className="font-medium min-w-32">
                    Section Name:
                  </label>
                  <input
                    type="text"
                    value={sectionNames[sectionKey] || ''}
                    onChange={(e) => handleSectionNameChange(sectionKey, e.target.value)}
                    className={`border rounded px-3 py-2 flex-1 ${
                      hasNameError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter section name"
                  />
                </div>
                
                {/* Seat Count Input */}
                <div className="flex items-center gap-4">
                  <label className="font-medium min-w-32">
                    Number of Seats:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={seatCounts[sectionKey] || ''}
                    onChange={(e) => handleSeatCountChange(sectionKey, e.target.value)}
                    className={`border rounded px-3 py-2 w-24 ${
                      hasSeatError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  <span className="text-gray-500">seats to add</span>
                </div>
                
                {/* Error Messages */}
                {hasNameError && (
                  <p className="text-red-500 text-sm">Section name cannot be empty</p>
                )}
                {hasSeatError && (
                  <p className="text-red-500 text-sm">Must add at least 1 seat</p>
                )}
              </div>
            );
          })}
          
          {/* Validation Message */}
          {!isFormValid() && zoomableSections.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
              <strong>Note:</strong> All sections must have a valid name and at least 1 seat before saving.
            </div>
          )}
          
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSave}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFormValid()
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isFormValid()}
            >
              Save Seats
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No General Admission sections found</div>
      )}
    </div>
  );
}