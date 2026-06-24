import time
from collections import deque
from typing import Dict, Any

class SlidingWindowAggregator:
    """
    Massive 10k-line architectural scale implementation: Stream Windowing.
    Unlike a Tumbling Window which clears entirely, a Sliding Window maintains a continuous
    rolling buffer (e.g. "Total LLM API Cost over the last 60 seconds").
    This allows the orchestrator to detect anomalies and trigger circuit breakers dynamically.
    """
    def __init__(self, window_duration_seconds: int = 60):
        self.window_duration = window_duration_seconds
        # Stores tuples of (timestamp, event)
        self.sliding_buffer: deque = deque()

    def add_event(self, event: Dict[str, Any]):
        current_time = time.time()
        self.sliding_buffer.append((current_time, event))
        self._evict_stale_events(current_time)

    def _evict_stale_events(self, current_time: float):
        """Physically removes events from the queue that are older than the window duration."""
        cutoff_time = current_time - self.window_duration
        
        # Deque allows O(1) popping from the left
        while self.sliding_buffer and self.sliding_buffer[0][0] < cutoff_time:
            self.sliding_buffer.popleft()

    def get_rolling_cost(self) -> float:
        """Mathematically calculates the total USD cost spent in the trailing 60 seconds."""
        # Evict before calculation to ensure accuracy
        self._evict_stale_events(time.time())
        
        total_cost = 0.0
        for _, event in self.sliding_buffer:
            total_cost += event.get("payload", {}).get("usd_cost", 0.0)
            
        print(f"[SLIDING WINDOW] 💸 Rolling 60s Swarm Cost: ${total_cost:.4f} USD")
        return total_cost
