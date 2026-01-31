from pypdf import PdfReader
from docx import Document as DocxDocument
from pdf2image import convert_from_bytes
import pytesseract
import io

def extract_text(file):
    filename = file.filename.lower()

    # ---------- PDF ----------
    if filename.endswith(".pdf"):
        pdf_bytes = file.file.read()

        # 1️⃣ Try normal PDF text extraction
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = "\n".join((page.extract_text() or "") for page in reader.pages)

        if text.strip():
            return text

        # 2️⃣ OCR fallback for scanned PDFs
        images = convert_from_bytes(pdf_bytes)
        ocr_text = []

        for img in images:
            ocr_text.append(
                pytesseract.image_to_string(img)
            )

        return "\n".join(ocr_text)

    # ---------- DOCX ----------
    if filename.endswith(".docx"):
        doc = DocxDocument(file.file)
        return "\n".join(p.text for p in doc.paragraphs)

    # ---------- TXT ----------
    try:
        return file.file.read().decode("utf-8")
    except Exception:
        return ""
