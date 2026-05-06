#!/bin/bash
cd "$(dirname "$0")"
python3 -m http.server 7373 & sleep 0.8 && open "http://localhost:7373" 2>/dev/null || xdg-open "http://localhost:7373"
wait
