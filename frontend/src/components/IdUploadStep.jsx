import { useRef, useState } from "react";

// Step 1 of the wizard: user uploads their NID/Student ID photo.
// On "Continue" we hand the file up to the parent, which runs it through the
// (mocked) OCR util and advances to the confirm-details step.
export default function IdUploadStep({ onContinue, isProcessing }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (selected) => {
    if (selected) setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-lg font-bold text-gray-800">Become a Volunteer</h1>
      <p className="mt-1 text-sm text-gray-500">
        Upload your NID or Student ID card to get started. We'll auto-fill your
        details.
      </p>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2
          border-dashed px-4 py-8 text-center transition
          ${isDragging ? "border-brand-accent bg-brand-accent-light" : "border-gray-300"}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-white">
          {/* simple upload arrow icon, no icon library needed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19V5m0 0-6 6m6-6 6 6"
            />
          </svg>
        </span>
        <p className="mt-2 text-xs text-gray-500">
          {file ? file.name : "Drag & drop or click to upload"}
        </p>
        {/* hidden native input that the dropzone/buttons trigger */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Use Camera / Choose File buttons */}
      <div className="mt-3 flex justify-center gap-3">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          📷 Use Camera
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          📄 Choose File
        </button>
      </div>

      {/* Continue: disabled until a file is picked, shows spinner text while "OCR" runs */}
      <button
        type="button"
        disabled={!file || isProcessing}
        onClick={() => onContinue(file)}
        className="mt-4 w-full rounded-lg bg-brand-accent py-2.5 text-sm font-semibold text-white
          transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-brand-accent/90"
      >
        {isProcessing ? "Reading ID…" : "Continue"}
      </button>
    </div>
  );
}
