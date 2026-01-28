from langdetect import detect, DetectorFactory
# Ensure deterministic results
DetectorFactory.seed = 0
def detect_language(text: str) -> str:
    try:
        return detect(text)
    except:
        return "en"


import re
INDIC_KEYWORDS = {
    "kya", "hai", "ka", "ki", "ke",
    "fees", "hostel", "admission"
}
def looks_romanized_indic(text: str) -> bool:
    tokens = re.findall(r"\w+", text.lower())
    overlap = len(set(tokens) & INDIC_KEYWORDS)

    if overlap >= 2:
        return True
    if overlap / max(len(tokens), 1) >= 0.3:
        return True
    return False
