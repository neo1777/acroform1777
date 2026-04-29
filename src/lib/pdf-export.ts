import { PDFDocument, rgb, PDFHexString } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Campo } from '../store/useAppStore';

export async function generaAcroForm(
  templateBytes: ArrayBuffer,
  campi: Campo[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  const form = pdfDoc.getForm();

  // Load a custom font to support accented characters and symbols properly
  let customFont;
  try {
    const fontUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    customFont = await pdfDoc.embedFont(fontBytes);
  } catch (err) {
    console.warn("Failed to load custom font, falling back to standard font", err);
  }

  for (const campo of campi) {
    const page = pdfDoc.getPages()[campo.pagina];
    
    // Check if field already exists (avoid throwing on duplicate name creation, though validation should prevent this)
    let textField;
    try {
      textField = form.getTextField(campo.nome);
    } catch (e) {
      // not found
    }

    if (!textField) {
      textField = form.createTextField(campo.nome);
    }

    // Draw a solid white rectangle on the page to hide the original underlying text
    page.drawRectangle({
      x: campo.x,
      y: campo.y,
      width: campo.width,
      height: campo.height,
      color: rgb(1, 1, 1), // Bianco
    });

    // Le coordinate sono già in pt, con origine in basso a sinistra
    const appearance = {
      x: campo.x,
      y: campo.y,
      width: campo.width,
      height: campo.height,
      borderWidth: 0,
      backgroundColor: rgb(1, 1, 1), // Imposta lo sfondo bianco anche per il campo
    };
    
    if (customFont) {
      // @ts-ignore
      appearance.font = customFont;
    }

    textField.addToPage(page, appearance);

    textField.setFontSize(campo.fontSize || 10);

    // Apply custom format if present via PDF dictionary (TU for tooltip/format hint)
    if (campo.formato) {
      // We set the "TU" (Tooltip/Alternative text) property which often helps in indicating format to users
      const fieldRef = textField.acroField.dict;
      fieldRef.set(pdfDoc.context.obj('TU'), PDFHexString.fromText(campo.formato));
    }

    // I campi dato S&A: contrassegnare come read-only
    if (campo.tipo === 'dato') {
      textField.enableReadOnly();
    }
    
    if (customFont) {
        textField.updateAppearances(customFont);
    }
  }

  return pdfDoc.save();
}

export function downloadPdf(bytes: Uint8Array, fileName: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
