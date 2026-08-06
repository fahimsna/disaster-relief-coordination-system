import { useState } from "react";
import Navbar from "../components/Navbar";
import IdUploadStep from "../components/IdUploadStep";
import VolunteerDetailsForm from "../components/VolunteerDetailsForm";
import { extractIdDetails } from "../utils/ocr";

// Wizard steps: 'upload' -> 'confirm' -> 'done'
export default function VolunteerRegistration() {
  const [step, setStep] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  // Step 1 -> runs the (mock) OCR, then advances to the confirm step
  const handleUploadContinue = async (file) => {
    setIsProcessing(true);
    const result = await extractIdDetails(file);
    setOcrData(result);
    setIsProcessing(false);
    setStep("confirm");
  };

  // Step 2 -> mock "submit", no real API call yet
  const handleFormSubmit = (payload) => {
    console.log("Mock volunteer registration payload:", payload); // inspect in devtools
    setSubmittedData(payload);
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      {step === "upload" && (
        <IdUploadStep
          onContinue={handleUploadContinue}
          isProcessing={isProcessing}
        />
      )}

      {step === "confirm" && ocrData && (
        <VolunteerDetailsForm ocrData={ocrData} onSubmit={handleFormSubmit} />
      )}

      {step === "done" && submittedData && (
        <div className="mx-auto mt-16 w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-bold text-gray-800">
            You're registered! 🎉
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Status set to{" "}
            <span className="font-medium text-brand-accent">available</span>.
            This is mock data only -- nothing was sent to a server.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-50 p-3 text-left text-xs text-gray-600">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
