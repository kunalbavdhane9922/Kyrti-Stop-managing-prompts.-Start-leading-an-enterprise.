import random
import time
import threading
import docker
from typing import List

class ChaosMonkey:
    """
    Massive FAANG-level Resilience Testing.
    Runs actively in production. Randomly selects healthy system components 
    and violently assassinates them to ensure Circuit Breakers and Sagas auto-heal.
    """
    def __init__(self, enabled: bool = False):
        self.enabled = enabled
        self.client = docker.from_env()
        self.targets = ["temporal-worker", "kafka-broker", "agent-sandbox"]
        
    def start_destruction_loop(self):
        if not self.enabled:
            print("[CHAOS] Simian Army is dormant. Peace maintained.")
            return
            
        print("[CHAOS] SIMIAN ARMY DEPLOYED. Active sabotage initiated.")
        thread = threading.Thread(target=self._assassination_daemon, daemon=True)
        thread.start()

    def _assassination_daemon(self):
        """Infinite loop of random infrastructure termination."""
        while True:
            # Sleep for a random interval between 30 and 300 seconds
            time.sleep(random.randint(30, 300))
            
            target_type = random.choice(self.targets)
            self._execute_kill_order(target_type)

    def _execute_kill_order(self, target_type: str):
        try:
            print(f"\n[CHAOS MONKEY] Selecting target: {target_type}...")
            containers = self.client.containers.list(filters={"name": target_type})
            
            if not containers:
                return
                
            victim = random.choice(containers)
            print(f"[CHAOS MONKEY] 🚨 EXECUTING KILL ORDER ON {victim.name} 🚨")
            
            # Send SIGKILL. No graceful shutdown allowed.
            victim.kill()
            
            print(f"[CHAOS MONKEY] Target destroyed. Awaiting system auto-recovery.")
            
        except Exception as e:
            pass # Chaos Monkey does not care about exceptions
