import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import IdUploadStep from "../components/IdUploadStep";
import VolunteerDetailsForm from "../components/VolunteerDetailsForm";
import { extractIdDetails } from "../utils/ocr";
import api from "../api/axios";

// Wizard steps: 'upload' -> 'confirm'. Redirects straight to /profile once
// the backend confirms the save (no more 'done' screen).
export default function VolunteerRegistration() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const response = await api.get("/volunteers/profile");
        // If profile exists, user is already registered
        navigate("/profile", { replace: true });
      } catch (error) {
        // 404 means no profile → stay on registration page
        if (error.response?.status !== 404) {
          console.error("Error checking registration:", error);
        }
      }
    };

    checkRegistration();
  }, [navigate]);

  const [step, setStep] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [ocrData, setOcrData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Step 1 -> runs real OCR now. If the card can't be read we stay on the
  // upload step and show why, instead of blowing up or silently advancing.
  const handleUploadContinue = async (file) => {
    setIsProcessing(true);
    setOcrError("");
    try {
      const result = await extractIdDetails(file);
      setOcrData(result);
      setStep("confirm");
    } catch (err) {
      setOcrError(
        err.message || "Could not read that card. Please try a clearer photo.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2 -> real POST. authMiddleware pulls the user off the JWT (the
  // axios interceptor already attaches it), so we don't send a userId.
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
          ocrError={ocrError}
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
