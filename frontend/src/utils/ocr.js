// OCR is mocked for now so I can test the UI flow without real image processing.
// Tesseract.js is already installed, so when I'm ready to implement the actual

// OCR, I'll need to uncomment the import below and replace the mock logic.
// import { createWorker } from 'tesseract.js'

/**
 * Simulates OCR extraction from an uploaded ID image.
 * Returns mock name and ID number after a short delay.
 *
 * Later: replace this with a real Tesseract call:
 *   const worker = await createWorker('eng');
 *   const { data: { text } } = await worker.recognize(imageFile);
 *   await worker.terminate();
 *   // Parse the text to extract name and ID (depends on card format).
 */
export async function extractIdDetails(imageFile) {
  await new Promise((resolve) => setTimeout(resolve, 1200)); // mimic processing
  return {
    fullName: "Zihadul Islam Tasin",
    idNumber: "23301690",
  };
}
