import os
from langchain_core.tools import tool
from app.runtime.tools.core import AgentContext, enforce_confinement

@tool
def write_to_file(relative_path: str, code_content: str, overwrite: bool = False) -> str:
    """Create new files or overwrite existing ones. Do NOT use this for minor edits."""
    try:
        target_file = os.path.join(AgentContext.current_jail_path, relative_path)
        enforce_confinement(target_file)
        
        if os.path.exists(target_file) and not overwrite:
            return f"Error: {relative_path} already exists. Set overwrite=True or use replace_file_content."
            
        os.makedirs(os.path.dirname(target_file), exist_ok=True)
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(code_content)
        return f"Successfully wrote {len(code_content)} chars to {relative_path}"
    except Exception as e:
        return f"Error writing file: {e}"

@tool
def replace_file_content(relative_path: str, target_content: str, replacement_content: str) -> str:
    """Make a single contiguous block edit to an existing file by matching exact target string."""
    try:
        target_file = os.path.join(AgentContext.current_jail_path, relative_path)
        enforce_confinement(target_file)
        
        with open(target_file, "r", encoding="utf-8") as f:
            content = f.read()
            
        if target_content not in content:
            return "Error: target_content not found exactly as provided in the file."
            
        # Count occurrences
        occurrences = content.count(target_content)
        if occurrences > 1:
            return "Error: target_content matches multiple locations. Be more specific."
            
        new_content = content.replace(target_content, replacement_content)
        
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(new_content)
            
        return f"Successfully replaced content in {relative_path}"
    except Exception as e:
        return f"Error replacing content: {e}"
