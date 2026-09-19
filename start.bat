@echo off
echo ===================================================
echo     ☕ VIBES CAFE DUAL PLATFORM LAUNCHER
echo ===================================================
echo.
echo Launching 2 Separate Websites:
echo   1. Customer Website:        http://localhost:3000
echo   2. Staff and Admin Portal:  http://localhost:3001
echo.

node server/app.js
if %errorlevel% neq 0 (
    echo.
    echo Node.js is not in your system PATH or not installed.
    echo You can also open "standalone_review.html" directly in your browser to preview all pages!
    echo.
    pause
)
