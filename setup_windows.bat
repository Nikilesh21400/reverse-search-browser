@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
title 🔧 ReverseSearch Browser - Windows Setup Script

echo ====================================================
echo 🔧 ReverseSearch Browser - Windows Setup Starting...
echo ====================================================

:: ----------------------------
:: Step 1: Check for Rust (cargo)
:: ----------------------------
where cargo >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo 🦀 Rust not found. Installing...
    powershell -Command "Invoke-WebRequest -Uri https://win.rustup.rs/ -OutFile rustup-init.exe"
    if exist rustup-init.exe (
        echo 🚀 Running Rust installer...
        powershell -Command "Start-Process .\\rustup-init.exe -ArgumentList '-y' -NoNewWindow -Wait"
        del rustup-init.exe
        echo ✅ Rust installed.
        echo 🔁 Please RESTART this terminal before continuing.
        pause
        goto :eof
    ) else (
        echo ❌ Failed to download rustup-init.exe
        pause
        goto :eof
    )
) ELSE (
    echo ✅ Rust already installed.
)

:: ----------------------------
:: Step 2: Check for MSVC Build Tools
:: ----------------------------
where cl >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ⚠️ MSVC Build Tools not found.
    echo    Please install "Desktop development with C++" via Visual Studio Installer.
    echo    Required for compiling Tauri apps.
    pause
) ELSE (
    echo ✅ MSVC Build Tools detected.
)

:: ----------------------------
:: Step 3: Check for Node.js
:: ----------------------------
where node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo 🔄 Node.js not found. Installing LTS version...
    powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/v18.18.2/node-v18.18.2-x64.msi -OutFile node_install.msi"
    if exist node_install.msi (
        echo 🚀 Running Node.js installer...
        start /wait msiexec /i node_install.msi /passive
        del node_install.msi
        echo ✅ Node.js installed.
        echo 🔁 Please RESTART this terminal before continuing.
        pause
        goto :eof
    ) else (
        echo ❌ Failed to download Node.js installer.
        pause
        goto :eof
    )
) ELSE (
    echo ✅ Node.js already installed.
)

:: ----------------------------
:: Step 4: Check for pnpm
:: ----------------------------
where pnpm >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing pnpm globally...
    call npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ pnpm installation failed.
        pause
        goto :eof
    ) ELSE (
        echo ✅ pnpm installed.
    )
) ELSE (
    echo ✅ pnpm already installed.
)

:: ----------------------------
:: Step 5: Install Tauri CLI
:: ----------------------------
cargo --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Rust not detected in PATH. Please restart terminal and rerun script.
    pause
    goto :eof
)

echo 🛠 Installing Tauri CLI...
cargo install tauri-cli
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install Tauri CLI.
    pause
    goto :eof
) ELSE (
    echo ✅ Tauri CLI installed.
)

:: ----------------------------
:: Step 6: Install project dependencies
:: ----------------------------
if exist package.json (
    echo 📦 Installing project dependencies with pnpm...
    pnpm install
    IF %ERRORLEVEL% NEQ 0 (
        echo ❌ pnpm install failed.
        pause
        goto :eof
    ) ELSE (
        echo ✅ Project dependencies installed.
    )
) ELSE (
    echo ❌ No package.json found in this folder.
    echo    Please run this script from your project root.
    pause
    goto :eof
)

:: ----------------------------
:: Done
:: ----------------------------
echo.
echo ====================================================
echo ✅ SETUP COMPLETE!
echo 💻 To run the browser in dev mode, use:
echo     pnpm tauri dev
echo ====================================================
echo.
pause
