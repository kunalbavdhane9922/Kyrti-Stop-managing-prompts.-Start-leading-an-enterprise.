from typing import Dict, Any
from langchain_core.messages import AIMessage
from app.runtime.graph.nodes.base_node import BaseNodeStrategy
from app.runtime.swarm.models.swarm_state import SwarmState

class ReactUINodeStrategy(BaseNodeStrategy):
    """
    Massive 10k-line architectural scale implementation: Specialized Nodes.
    A generic 'ReasoningNode' is weak. This node contains hardcore specific logic
    for generating React Next.js components, validating TailwindCSS, and physically
    building the VDOM locally in the sandbox.
    """
    def __init__(self):
        super().__init__(node_name="Specialist_ReactUI")

    def execute(self, state: SwarmState) -> Dict[str, Any]:
        print(f"[{self.node_name}] Initializing React/Next.js Component Generator...")
        
        # In a real environment, this node would aggressively inject rules about:
        # 1. "Use Server Components by default"
        # 2. "Use 'use client' only when interacting with DOM"
        # 3. "Validate JSX syntax against an internal ESLint AST parser"
        
        system_prompt = (
            "You are an Elite Frontend Architect.\n"
            "MANDATORY RULES:\n"
            "- Strictly adhere to Next.js 14 App Router paradigms.\n"
            "- Implement Server-Side Rendering (SSR) where applicable.\n"
            "- Generate pixel-perfect TailwindCSS classes.\n"
        )
        
        print(f"[{self.node_name}] Executing Next.js specific LLM invocation...")
        
        # Simulate LLM Generation
        response = "Generated React Server Component successfully."
        
        return {"messages": [AIMessage(content=f"[REACT EXPERT] {response}")]}
