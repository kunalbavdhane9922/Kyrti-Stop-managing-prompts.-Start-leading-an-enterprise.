#!/bin/bash
# Start FastAPI in the background
uvicorn main:app --host 0.0.0.0 --port 8001 &

# Start the Temporal worker in the foreground
python worker.py
