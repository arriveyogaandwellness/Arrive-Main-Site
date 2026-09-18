@echo off
title The Art of Arrival Retreat - Local Server Launcher
cd /d "%~dp0"

echo ======================================================================
echo           THE ART OF ARRIVAL RETREAT - COSTA RICA
echo              Carly Anne Kasinpila ^| Arrive Yoga
echo ======================================================================
echo.

if not exist node_modules (
    echo [1/3] Installing dependencies ^(Express, Stripe, Cors, Dotenv^)...
    call npm install
) else (
    echo [1/3] Dependencies verified.
)

echo [2/3] Starting web server and Stripe gateway on port 3000...
start "" cmd /c "node server.js & pause"

timeout /t 2 /nobreak >nul

echo [3/3] Opening your browser to the experience...
start http://localhost:3000

echo.
echo Server is running! View live at: http://localhost:3000
echo Stripe Setup Portal:           http://localhost:3000/stripe-setup.html
echo.
pause
