import os
import subprocess
from langchain_core.tools import tool
from app.runtime.tools.core import AgentContext, enforce_confinement

@tool
def list_directory(relative_path: str = ".") -> str:
    """List the contents of a directory. Essential for understanding project structure."""
    try:
        target_dir = os.path.join(AgentContext.current_jail_path, relative_path)
        enforce_confinement(target_dir)
        
        result = subprocess.run(f"ls -la {target_dir}", shell=True, capture_output=True, text=True, timeout=10)
        return result.stdout if result.returncode == 0 else result.stderr
    except Exception as e:
        return f"Error listing directory: {e}"

@tool
def view_file(relative_path: str, start_line: int = 1, end_line: int = 800) -> str:
    """View the contents of a file. Supports line ranges to handle very large files safely."""
    try:
        target_file = os.path.join(AgentContext.current_jail_path, relative_path)
        enforce_confinement(target_file)
        
        with open(target_file, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        content = "".join(lines[start_line - 1:end_line])
        return f"--- FILE: {relative_path} (Lines {start_line}-{end_line}) ---\n{content}"
    except Exception as e:
        return f"Error viewing file: {e}"

@tool
def grep_search(query: str, relative_path: str = ".") -> str:
    """Search for exact pattern matches within files or directories."""
    try:
        target_path = os.path.join(AgentContext.current_jail_path, relative_path)
        enforce_confinement(target_path)
        
        # Using standard grep for cross-platform compatibility within the docker jail
        cmd = f"grep -rnw '{target_path}' -e '{query}'"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=15)
        return result.stdout if result.stdout else "No matches found."
    except Exception as e:
        return f"Error executing grep: {e}"
