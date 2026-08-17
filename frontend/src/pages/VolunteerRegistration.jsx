import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import IdUploadStep from "../components/IdUploadStep";
import VolunteerDetailsForm from "../components/VolunteerDetailsForm";
import { extractIdDetails } from "../utils/ocr";
import api from "../api/axios";

// Wizard steps: 'upload' -> 'confirm'. No more 'done' screen -- we just
// redirect straight to /profile once the backend confirms the save.
export default function VolunteerRegistration() {
  const navigate = useNavigate();

  const [step, setStep] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Step 1 -> runs the (mock) OCR, then advances to the confirm step
  const handleUploadContinue = async (file) => {
    setIsProcessing(true);
    const result = await extractIdDetails(file);
    setOcrData(result);
    setIsProcessing(false);
    setStep("confirm");
  };

  // Step 2 -> real POST now. authMiddleware pulls the user off the JWT
  // (the axios interceptor already attaches it), so we don't send a userId.
  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/volunteers/register", payload);
      navigate("/profile");
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || "Registration failed, please try again.",
      );
      setIsSubmitting(false);
    }
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
        <>
          <VolunteerDetailsForm
            ocrData={ocrData}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
          {submitError && (
            <p className="mx-auto mt-3 max-w-md text-center text-xs text-red-500">
              {submitError}
            </p>
          )}
        </>
      )}
    </div>
  );
}
