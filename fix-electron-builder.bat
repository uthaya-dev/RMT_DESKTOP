@echo off
setlocal

echo ============================
echo ELECTRON BUILDER CLEANUP TOOL
echo ============================

REM Step 1: Close Node.js / Electron Builder if running
echo.
echo Closing any running Electron/Node processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM electron.exe >nul 2>&1

REM Step 2: Delete electron-builder cache folders
echo.
echo Deleting electron-builder cache folders...
rmdir /S /Q "%LocalAppData%\electron-builder\Cache\nsis"
rmdir /S /Q "%LocalAppData%\electron-builder\Cache\winCodeSign"

REM Step 3: Confirm clean
echo.
echo Cache folders deleted.

REM Step 4: Navigate to project directory
echo.
cd /d "E:\Kaathadi\Clients\RMT_DESKTOP_TryToExe"

REM Step 5: Run build command
echo Starting electron-builder...
call npm run dist

echo.
echo ============================
echo Done! Check for any new errors.
echo ============================

pause
endlocal
