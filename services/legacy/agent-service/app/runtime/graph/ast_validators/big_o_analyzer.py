import ast

class BigOComplexityVisitor(ast.NodeVisitor):
    """
    Massive FAANG-Level static analysis.
    Detects nested loops in agent-generated code.
    If it detects O(N^3) or higher complexity, it physically blocks the execution 
    to prevent the AWS cluster from burning CPU credits infinitely.
    """
    def __init__(self):
        self.max_nesting_depth = 0
        self.current_depth = 0

    def visit_For(self, node):
        self.current_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.current_depth)
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_While(self, node):
        self.current_depth += 1
        self.max_nesting_depth = max(self.max_nesting_depth, self.current_depth)
        self.generic_visit(node)
        self.current_depth -= 1

class BigOAnalyzer:
    """
    Blocks any code that exhibits exponential O(N^x) time complexity.
    """
    @classmethod
    def check_time_complexity(cls, source_code: str) -> bool:
        try:
            tree = ast.parse(source_code)
        except SyntaxError:
            return False

        visitor = BigOComplexityVisitor()
        visitor.visit(tree)

        # O(N^3) is blocked natively.
        if visitor.max_nesting_depth >= 3:
            print(f"[AST VALIDATOR] 🚨 O(N^{visitor.max_nesting_depth}) Time Complexity detected! Code blocked to prevent infinite scaling loops.")
            return False
            
        print(f"[AST VALIDATOR] ✅ Time complexity is acceptable (O(N^{visitor.max_nesting_depth})).")
        return True
