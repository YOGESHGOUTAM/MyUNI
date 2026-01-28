def translate(text:str,target_lang:str)-> str:
    if target_lang=="en":
        return text
    return f"[{target_lang} translation pending]{text}"