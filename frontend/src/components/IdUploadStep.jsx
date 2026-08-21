import { useEffect, useRef, useState } from "react";

// phone photos can get huge -- no point uploading/processing anything past this
const MAX_FILE_SIZE_MB = 10;

// Step 1 of the wizard: user uploads their NID/Student ID photo.
// On "Continue" we hand the file up to the parent, which runs it through
// (real) OCR and either advances to confirm or reports back an error via `ocrError`.
export default function IdUploadStep({ onContinue, isProcessing, ocrError }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null); // mobile fallback -- opens the native camera app via capture=environment
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // reject anything that isn't a reasonably-sized image before we bother the OCR step with it
  const validateFile = (selected) => {
    if (!selected.type.startsWith("image/")) {
      return "That doesn't look like an image. Please upload a photo of your card.";
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Image is too large -- please keep it under ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = (selected) => {
    if (!selected) return;
    const err = validateFile(selected);
    if (err) {
      setValidationError(err);
      setFile(null);
      return;
    }
    setValidationError("");
    setFile(selected);
  };

  // swap the preview thumbnail whenever `file` changes, cleaning up the old
  // object URL each time so we're not leaking memory across re-uploads
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  // ---- "Use Camera" ------------------------------------------------------
  // Mobile: the hidden capture=environment input opens the native camera
  // app directly -- nicer than a custom preview, so we use that first.
  // Desktop: capture= is ignored by desktop browsers (it just opens the
  // regular file picker), so "Use Camera" wouldn't do anything useful there
  // without this -- getUserMedia gives us an actual live webcam preview.
  const openCamera = async () => {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      cameraInputRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      // video element isn't mounted until isCameraOpen flips true and we
      // re-render, so attach the stream right after in a microtask
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 0);
    } catch {
      // no webcam, or permission denied -- fall back to the plain file picker
      setValidationError("Couldn't access your camera. Choose a file instead.");
      fileInputRef.current?.click();
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const captureFromCamera = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob)
          handleFile(
            new File([blob], "camera-capture.jpg", { type: "image/jpeg" }),
          );
        closeCamera();
      },
      "image/jpeg",
      0.92,
    );
  };

  // stop the webcam stream if we unmount while it's still open
  useEffect(
    () => () => streamRef.current?.getTracks().forEach((t) => t.stop()),
    [],
  );

  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-lg font-bold text-gray-800">Become a Volunteer</h1>
      <p className="mt-1 text-sm text-gray-500">
        Upload your NID or Student ID card to get started. We'll auto-fill your
        details.
      </p>

      {isCameraOpen ? (
        // live webcam preview -- desktop "Use Camera" path only
        <div className="mt-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-black"
          />
          <div className="mt-3 flex justify-center gap-3">
            <button
              type="button"
              onClick={closeCamera}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={captureFromCamera}
              className="rounded-md bg-brand-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-accent/90"
            >
              📸 Capture
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Dropzone -- shows a thumbnail once a file's picked instead of just the filename */}
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
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected ID"
                className="h-24 rounded-md object-contain"
              />
            ) : (
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
            )}
            <p className="mt-2 text-xs text-gray-500">
              {file ? file.name : "Drag & drop or click to upload"}
            </p>
            {/* hidden native input that the dropzone/"Choose File" button trigger */}
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
              onClick={openCamera}
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

          {/* file-validation errors and OCR/parsing errors from the parent share this spot */}
          {(validationError || ocrError) && (
            <p className="mt-3 text-center text-xs text-red-500">
              {validationError || ocrError}
            </p>
          )}

          {/* Continue: disabled until a file is picked, shows spinner text while OCR runs */}
          <button
            type="button"
            disabled={!file || isProcessing}
            onClick={() => onContinue(file)}
            className="mt-4 w-full rounded-lg bg-brand-accent py-2.5 text-sm font-semibold text-white
              transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-brand-accent/90"
          >
            {isProcessing ? "Reading ID…" : "Continue"}
          </button>
        </>
      )}
    </div>
  );
}
