@echo off
echo Starting Attendance Application...

:: Open Backend in a new window
echo Starting Backend...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "node server.js"

:: Open Frontend in a new window
echo Starting Frontend...
cd /d "%~dp0frontend"
start "Frontend Dev Server" cmd /k "npm run dev"

echo Done! Both services are starting in separate windows.
pause
