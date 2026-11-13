@echo off
setlocal
cd /d "%~dp0"
echo NOVRA WELLNESS - 25 SCREEN WEBSITE
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Please install Node.js 22 LTS from nodejs.org.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed. Check internet connection and npm configuration.
    pause
    exit /b 1
  )
)
call npm run dev
pause
