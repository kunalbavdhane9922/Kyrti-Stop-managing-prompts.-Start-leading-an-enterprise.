import sys
from fastapi import FastAPI
from app.api.routes import router
from app.api.live_stream import router as ws_router

# Massive Enterprise Architecture Imports
from app.chaos.manager.chaos_monkey import ChaosMonkey
from app.chaos.injectors.network_faults import NetworkFaultInjector

# The Overlord Singularity Core
from app.evolution.overlord.telemetry_analyzer import OverlordAnalyst

app = FastAPI(title="Sovereign AI Execution Platform (SAEP)", version="FAANG-Scale")

# Register standard and live-stream routing
app.include_router(router)
app.include_router(ws_router)

@app.on_event("startup")
async def startup_event():
    print("--------------------------------------------------")
    print("🚀 SOVEREIGN AI EXECUTION ENGINE ONLINE")
    print("--------------------------------------------------")
    
    # Check for Chaos Mode Flag
    if "--enable-chaos-mode" in sys.argv:
        print("\n⚠️ WARNING: CHAOS MODE ACTIVATED ⚠️")
        print("The Simian Army will now actively attempt to destroy the cluster.")
        
        # 1. Enable random Network Faults (Latency & Packet Drops)
        NetworkFaultInjector.enable_chaos()
        
        # 2. Deploy the Chaos Monkey to start assassinating Docker/Temporal workers
        monkey = ChaosMonkey(enabled=True)
        monkey.start_destruction_loop()

    # Deploy the Meta-Compiler Singularity
    print("\n[SYSTEM] Deploying Overlord Analyst Daemon...")
    overlord = OverlordAnalyst(failure_threshold=3)
    overlord.start_monitoring()

if __name__ == "__main__":
    import uvicorn
    # If starting via script, pass standard args. 
    # To test invincibility, run: python main.py --enable-chaos-mode
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
