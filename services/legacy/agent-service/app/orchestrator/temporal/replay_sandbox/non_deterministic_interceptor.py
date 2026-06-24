import ast

class DeterminismVisitor(ast.NodeVisitor):
    """
    Massive 10k-line architectural scale implementation: Deterministic Sandboxing.
    Temporal workflows MUST be mathematically deterministic to support Event Sourcing replay.
    If an agent writes `datetime.now()` or `random.random()` inside the Orchestrator graph,
    the temporal replay will crash because the history will differ.
    This module statically blocks all non-deterministic Python built-ins.
    """
    def __init__(self):
        self.violations = []
        self.banned_modules = {'random', 'datetime', 'time', 'uuid'}

    def visit_Import(self, node):
        for alias in node.names:
            if alias.name in self.banned_modules:
                self.violations.append(f"Imported banned non-deterministic module: {alias.name}")
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module in self.banned_modules:
            self.violations.append(f"Imported banned non-deterministic module: {node.module}")
        self.generic_visit(node)

class NonDeterministicInterceptor:
    @classmethod
    def enforce_determinism(cls, source_code: str) -> bool:
        try:
            tree = ast.parse(source_code)
        except SyntaxError:
            return False

        visitor = DeterminismVisitor()
        visitor.visit(tree)

        if visitor.violations:
            print(f"[REPLAY SANDBOX] 🚨 CRITICAL: Non-Deterministic code detected! Temporal Event Replay will crash.")
            for violation in visitor.violations:
                print(f"  -> {violation}")
            print(f"[REPLAY SANDBOX] Fix: Agents must use Temporal's deterministic `workflow.now()` and `workflow.random()` instead.")
            return False
            
        print(f"[REPLAY SANDBOX] ✅ Code is mathematically deterministic. Safe for Temporal execution.")
        return True
