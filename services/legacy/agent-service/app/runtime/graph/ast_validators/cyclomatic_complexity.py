import ast

class CyclomaticComplexityVisitor(ast.NodeVisitor):
    """
    Traverses the Abstract Syntax Tree of agent-generated code.
    Mathematically counts decision points (if, for, while, and, or) to ensure
    the code is not overly complex (spaghetti code).
    """
    def __init__(self):
        self.complexity = 1

    def visit_If(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_For(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_While(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_BoolOp(self, node):
        self.complexity += len(node.values) - 1
        self.generic_visit(node)
        
    def visit_ExceptHandler(self, node):
        self.complexity += 1
        self.generic_visit(node)
        
    def visit_With(self, node):
        self.complexity += 1
        self.generic_visit(node)

class ComplexityAnalyzer:
    """
    Part of the massive 10,000-line Graph Compiler Expansion.
    Before the Docker sandbox even boots, this module parses the raw LLM string,
    builds the AST, and rejects the code if it exceeds a hard complexity threshold.
    """
    MAX_COMPLEXITY = 15

    @classmethod
    def analyze_code(cls, source_code: str) -> bool:
        try:
            tree = ast.parse(source_code)
        except SyntaxError as e:
            raise ValueError(f"CRITICAL: Agent produced syntactically invalid Python: {e}")

        visitor = CyclomaticComplexityVisitor()
        visitor.visit(tree)

        if visitor.complexity > cls.MAX_COMPLEXITY:
            print(f"[AST VALIDATOR] 🚨 Code Rejected! Cyclomatic Complexity ({visitor.complexity}) exceeds maximum allowed ({cls.MAX_COMPLEXITY}).")
            return False
            
        print(f"[AST VALIDATOR] ✅ Code passed complexity check (Score: {visitor.complexity}).")
        return True
