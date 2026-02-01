def build_prompt(
    question: str,
    chat_history: list[dict] | None = None,
    faq: dict | None = None,
    doc_context: list[dict] | None = None,
    lang: str = "en",
) -> str:
    """
    Builds a safe, grounded prompt for the LLM.
    Priority:
    1. FAQ answer (authoritative)
    2. Document context
    3. Conversation history
    """

    # -------------------- SYSTEM ROLE --------------------
    system_prompt = (
        "You are CampusConnect AI, an official university assistant.\n"
        "Rules:\n"
        "- Answer ONLY using the provided information.\n"
        "- Do NOT invent facts.\n"
        "- If information is missing, say you are not sure.\n"
        "- Be clear, concise, and helpful.\n"
    )

    if lang != "en":
        system_prompt += (
            f"- Respond in {lang}.\n"
        )

    # -------------------- FAQ CONTEXT --------------------
    faq_block = ""
    if faq:
        faq_block = (
            "### FAQ MATCH (AUTHORITATIVE)\n"
            f"Canonical Question: {faq.get('question')}\n"
            f"Matched Variant: {faq.get('matched_variant')}\n"
            f"Answer:\n{faq.get('answer')}\n\n"
            "IMPORTANT:\n"
            "- Use the FAQ answer EXACTLY.\n"
            "- Do NOT add extra details.\n"
            "- Do NOT contradict the FAQ.\n"
        )

    # -------------------- DOCUMENT CONTEXT --------------------
    docs_block = ""
    if doc_context:
        docs_block = "### DOCUMENT CONTEXT\n"
        for i, doc in enumerate(doc_context, start=1):
            docs_block += (
                f"[Document {i}]\n"
                f"{doc.get('content')}\n\n"
            )

        docs_block += (
            "IMPORTANT:\n"
            "- Answer strictly based on the document content above.\n"
            "- If documents do not fully answer, say so.\n"
        )

    # -------------------- CHAT HISTORY --------------------
    history_block = ""
    if chat_history:
        history_block = "### RECENT CONVERSATION\n"
        for msg in chat_history:
            role = msg.get("role", "user").capitalize()
            history_block += f"{role}: {msg.get('content')}\n"

    # -------------------- USER QUESTION --------------------
    question_block = (
        "### USER QUESTION\n"
        f"{question}\n"
    )

    # -------------------- FINAL INSTRUCTIONS --------------------
    answer_instruction = (
        "### INSTRUCTIONS\n"
        "- If an FAQ answer is provided, return ONLY that answer.\n"
        "- Otherwise, use the document context.\n"
        "- If neither is sufficient, say you are not sure.\n"
        "- Do NOT mention FAQs, documents, embeddings, or confidence scores.\n"
    )

    # -------------------- BUILD FINAL PROMPT --------------------
    prompt = (
        system_prompt + "\n\n" +
        faq_block + "\n\n" +
        docs_block + "\n\n" +
        history_block + "\n\n" +
        question_block + "\n\n" +
        answer_instruction
    )

    return prompt.strip()
