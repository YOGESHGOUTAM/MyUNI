def build_prompt(question, chat_history=None, faq=None, doc_context=None, lang="en"):
    system_msg = (
        "You are CampusConnect, a helpful university assistant. "
        "Use provided official policy excerpts if available. "
        "Be concise, correct, and factual."
    )

    messages = [{"role": "system", "content": system_msg}]

    # chat history
    if chat_history:
        for msg in chat_history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

    # FAQ context
    if faq:
        messages.append({
            "role": "system",
            "content": (
                f"Relevant FAQ:\n"
                f"Q: {faq['canonical_question']}\n"
                f"A: {faq['answer_en']}"
            )
        })

    # document context (RAG)
    if doc_context:
        for doc in doc_context:
            messages.append({
                "role": "system",
                "content": f"Document extract: {doc['content']}"
            })

    # final question
    messages.append({"role": "user", "content": question})

    return messages
