@echo off
echo Starting Question Paper Repository Server...
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server...
call node server.js
pause
