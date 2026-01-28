from pypdf import PdfReader
from docx import Document as DocxDocument

def extract_text(file):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        return "\n".join((page.extract_text() or "") for page in reader.pages)

    if filename.endswith(".docx"):
        doc = DocxDocument(file.file)
        return "\n".join(p.text for p in doc.paragraphs)

    # TXT fallback
    try:
        return file.file.read().decode("utf-8")
    except:
        return ""
