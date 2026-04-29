import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function screenToPdf(
  screenX: number,
  screenY: number,
  canvasHeight: number,
  scale: number,
  pdfHeight: number
): { x: number; y: number } {
  // Pass 1: screen to pt
  const xPt = screenX / scale;
  const yFromTopPt = screenY / scale;

  // Pass 2: invert Y (PDF has bottom-left origin)
  const yPt = pdfHeight - yFromTopPt;

  return { x: xPt, y: yPt };
}

export function screenRectToPdf(
  rect: { left: number; top: number; width: number; height: number },
  canvasHeight: number,
  scale: number,
  pdfHeight: number
): { x: number; y: number; width: number; height: number } {
  const origin = screenToPdf(rect.left, rect.top + rect.height, canvasHeight, scale, pdfHeight);
  return {
    x: origin.x,
    y: origin.y,
    width: rect.width / scale,
    height: rect.height / scale,
  };
}

export function pdfToScreen(
  pdfX: number,
  pdfY: number,
  pdfHeight: number,
  scale: number
): { x: number; y: number } {
  // Invert Y
  const yFromTopPt = pdfHeight - pdfY;

  // Convert to screen pixels
  return {
    x: pdfX * scale,
    y: yFromTopPt * scale,
  };
}

export function pdfRectToScreen(
  rect: { x: number; y: number; width: number; height: number },
  pdfHeight: number,
  scale: number
): { left: number; top: number; width: number; height: number } {
  const screenOrigin = pdfToScreen(rect.x, rect.y, pdfHeight, scale);
  const screenWidth = rect.width * scale;
  const screenHeight = rect.height * scale;
  
  // PDF origin is bottom-left. Screen origin is top-left.
  // The screen Y of the top edge is screenOrigin.y - screenHeight
  
  return {
    left: screenOrigin.x,
    top: screenOrigin.y - screenHeight,
    width: screenWidth,
    height: screenHeight,
  };
}
