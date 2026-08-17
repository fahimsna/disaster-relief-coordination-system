// Real OCR now -- swaps the old mock for actual Tesseract.js text recognition
// + our own regex parsing to pull fullName/idNumber out of an NID or Student ID.
import { createWorker } from "tesseract.js";

// ---- image preprocessing -------------------------------------------------
// Tesseract does noticeably better on a smaller, grayscale, higher-contrast
// image than on a raw multi-MP phone photo -- so we downscale + grayscale on
// a <canvas> before handing it to the worker. Keeps recognize() fast too.
const MAX_DIMENSION = 1600; // long edge, px -- legible but not slow

async function preprocessImage(file) {
  const bitmap = await createImageBitmap(file); // throws on formats the browser can't decode (e.g. HEIC on non-Safari)

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);

  // grayscale + a light contrast bump -- makes printed text pop for OCR
  const imageData = ctx.getImageData(0, 0, width, height);
  const px = imageData.data;
  for (let i = 0; i < px.length; i += 4) {
    const gray = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114; // luminosity formula
    const contrasted = Math.min(255, Math.max(0, (gray - 128) * 1.2 + 128)); // stretch around mid-gray
    px[i] = px[i + 1] = px[i + 2] = contrasted;
  }
  ctx.putImageData(imageData, 0, 0);

  return canvas; // Tesseract.recognize() accepts a canvas directly, no need to blob it
}

// ---- parsing ---------------------------------------------------------------
// words we never want mistaken for a person's name when scanning for an
// all-caps "name-looking" line on the card
const NAME_STOPWORDS = new Set([
  "STUDENT",
  "UNIVERSITY",
  "COLLEGE",
  "INSTITUTE",
  "SCHOOL",
  "DEPARTMENT",
  "BRAC",
  "BACHELOR",
  "SCIENCE",
  "ENGINEERING",
  "COMPUTER",
  "BLOOD",
  "GROUP",
  "VALIDITY",
  "NATIONAL",
  "CARD",
  "GOVERNMENT",
  "BANGLADESH",
  "PEOPLES",
  "REPUBLIC",
  "OF",
  "THE",
  "ID",
]);

// Finds the closest all-caps, 2+ word line BEFORE the line the ID number was
// found on. Proximity beats "first caps line in the doc" -- that naive
// version kept grabbing the institution name instead of the person's name
// on generic cards (tested against a fake "ABC COLLEGE / JOHN DOE SMITH" card).
function findCapsName(lines, beforeIndex = lines.length) {
  let candidate = null;
  for (let i = 0; i < beforeIndex; i++) {
    const cleaned = lines[i].trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length < 2) continue;
    const isAllCaps =
      cleaned === cleaned.toUpperCase() && /^[A-Z\s.]+$/.test(cleaned);
    if (!isAllCaps) continue;
    if (words.some((w) => NAME_STOPWORDS.has(w))) continue;
    candidate = cleaned; // keep overwriting -- we want the one closest to the ID line
  }
  return candidate;
}

function lineIndexMatching(lines, regex) {
  const i = lines.findIndex((l) => regex.test(l));
  return i === -1 ? lines.length : i;
}

/**
 * Tries each known card layout in order and returns the first match.
 * Returns { fullName, idNumber } or null if nothing recognizable was found.
 *
 * Exported on its own (separate from the OCR call) so we can unit-test the
 * parsing against sample text without needing a real image/worker.
 */
export function parseCardText(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // 1 & 2. Bangladeshi NID -- "NAME:" + "ID NO:" labels.
  // Real NIDs come in 10-, 13-, or 17-digit formats depending on when they
  // were issued (our own NID sample was 13-digit, not 10 or 17!) -- same
  // label either way, so we grab the full digit run and check its length
  // instead of hardcoding to just 10 or 17 and truncating longer numbers.
  const nidIdMatch = text.match(/ID\s*NO[:\s.]*([0-9]{10,17})/i);
  if (nidIdMatch && [10, 13, 17].includes(nidIdMatch[1].length)) {
    const nidNameMatch = text.match(/NAME[:\s]*([^\n]+)/i);
    const idLine = lineIndexMatching(lines, /ID\s*NO/i);
    const fullName = nidNameMatch
      ? nidNameMatch[1]
          .trim()
          .replace(/[^A-Za-z.\s]+$/, "")
          .trim() // trim any OCR junk trailing the name
      : findCapsName(lines, idLine); // fallback if the "NAME:" label itself got misread
    if (fullName) return { fullName, idNumber: nidIdMatch[1] };
  }

  // 3. University Student ID -- "Student ID :" label, name is the all-caps
  // line printed above it (matches our BRAC sample, likely others too).
  const studentIdMatch = text.match(/Student\s*ID[:\s.]*([0-9]{6,8})/i);
  if (studentIdMatch) {
    const idLine = lineIndexMatching(lines, /Student\s*ID/i);
    const fullName = findCapsName(lines, idLine);
    if (fullName) return { fullName, idNumber: studentIdMatch[1] };
  }

  // 4. Generic student ID pattern -- e.g. "STU-12345" or "2023-1234", for
  // cards from other institutions that don't match BRAC's exact layout.
  const genericIdMatch = text.match(/\b([A-Z]{2,5}-\d{4,8}|\d{4}-\d{3,6})\b/);
  if (genericIdMatch) {
    const idLine = lineIndexMatching(lines, /[A-Z]{2,5}-\d{4,8}|\d{4}-\d{3,6}/);
    const fullName = findCapsName(lines, idLine);
    if (fullName) return { fullName, idNumber: genericIdMatch[1] };
  }

  // 5. none of the layouts matched
  return null;
}

// ---- public entry point ----------------------------------------------------
/**
 * Runs the uploaded ID image through Tesseract, then parses the result.
 * Throws a user-friendly Error if the image can't be decoded or the card
 * layout isn't recognized, so the UI can show it directly.
 */
export async function extractIdDetails(imageFile) {
  let processed;
  try {
    processed = await preprocessImage(imageFile);
  } catch {
    // most likely a format the browser can't decode -- HEIC from an iPhone
    // is the big one, Chrome/Firefox can't read it even though Safari can
    throw new Error(
      "Couldn't open that image. Try a JPG or PNG (iPhones often save photos as HEIC, which not every browser can read).",
    );
  }

  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(processed);
    const parsed = parseCardText(text);
    if (!parsed) {
      throw new Error(
        "Unrecognized card. Please upload a valid NID or Student ID.",
      );
    }
    return parsed;
  } finally {
    await worker.terminate(); // always clean up the worker, even if parsing threw
  }
}
