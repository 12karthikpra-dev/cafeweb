@echo off
echo ===================================================
echo     ? VIBES CAFE - CUSTOMER WEBSITE LAUNCHER
echo ===================================================
echo.
echo Starting Customer Website at http://localhost:3000...
echo.
if not exist node_modules (
    echo Installing node dependencies...
    npm install
)
node server/app.js
pause
