LLM_CHAT_URL = "http://localhost:11434/api/chat"
# LLM_GENERATE_URL = "http://localhost:11434/api/generate"
CHAT_MODEL = "chat"
# REFINED_MODEL = "refined"


def build_prompt(context_list, history_blocks, user_query):
    """
    Builds the list of messages in the format expected by ollama.chat.
    Ensures roles are lowercase for Ollama API.
    """
    context = "\n\n".join(context_list)
    messages = [
        {"role": "system", "content": f"Context:\n{context}"}
    ]

    for block in history_blocks:
        parts = block.split(": ", 1)
        if len(parts) == 2:
            role_str, content = parts
            role = "user" if role_str.lower() == "user" else "assistant"
            messages.append({
                "role": role,
                "content": content[:200] if role=="user" else content,
            })
        else:
            print(f"Warning: Could not parse history block: {block}")

    messages.append({"role": "user", "content": user_query})

    return messages
