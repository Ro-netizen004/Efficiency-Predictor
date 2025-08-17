#!/bin/bash
# Start Flask app with Gunicorn

gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --timeout 120
