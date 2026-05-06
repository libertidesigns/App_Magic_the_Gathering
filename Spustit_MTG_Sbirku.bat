@echo off
title MTG Sbírka
python -m http.server 7373 --directory "%~dp0" >nul 2>&1 & timeout /t 1 >nul & start "" "http://localhost:7373"
