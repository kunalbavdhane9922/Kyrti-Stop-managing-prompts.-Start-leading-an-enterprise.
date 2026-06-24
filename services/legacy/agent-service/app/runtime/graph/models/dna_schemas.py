from typing import List, Dict, Optional
from pydantic import BaseModel, Field, validator

class SkillSchema(BaseModel):
    name: str = Field(..., min_length=2)
    proficiency: int = Field(default=100, ge=0, le=100)
    required_tools: List[str] = Field(default_factory=list)

class ProfessionDNASchema(BaseModel):
    """
    Validates the JSON payload coming from the Java Platform Services.
    Ensures that the Agent DNA contains all required cognitive parameters before
    the Graph Compiler attempts to build the DAG.
    """
    role: str = Field(..., description="The cognitive role, e.g., 'Backend Engineer'")
    traits: List[str] = Field(default_factory=list, description="Behavioral modifiers for the LLM prompt.")
    skills: List[SkillSchema] = Field(default_factory=list, description="Specific capabilities of the agent.")
    allowed_tools: List[str] = Field(default_factory=list, description="The strict whitelist of executable tools.")
    max_parallel_nodes: int = Field(default=1, description="How many sub-thoughts can execute simultaneously.")
    cost_limit_usd: float = Field(default=10.0, description="Circuit breaker threshold for LLM token burn.")

    @validator("allowed_tools")
    def validate_tools(cls, v):
        # We could enforce that agents never have access to raw 'eval' or dangerous tools here.
        dangerous_tools = ["raw_eval", "system_rm"]
        for tool in v:
            if tool in dangerous_tools:
                raise ValueError(f"SECURITY BREACH: Tool {tool} is prohibited in agent DNA.")
        return v
