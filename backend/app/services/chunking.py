def chunk_text(text: str, size=500, overlap=50):
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + size
        chunks.append(" ".join(words[start:end]))
        start=max(0,end-overlap)
        if start>=end:
            break

    return chunks
