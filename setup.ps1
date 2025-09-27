# ===============================================
# ReverseSearch Browser - Windows Setup (PowerShell)
# Run from VS Code terminal:  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned; .\setup.ps1
# ===============================================

$ErrorActionPreference = "Stop"

function Ensure-Admin {
  $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
  if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "🔐 Elevating to Administrator..." -ForegroundColor Yellow
    Start-Process "powershell" "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
  }
}

function Has-Command($name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Install-WithWinget($id, $extraArgs = "") {
  if (Has-Command "winget") {
    Write-Host "⬇️  Installing $id via winget..." -ForegroundColor Yellow
    winget install --id $id -e --accept-package-agreements --accept-source-agreements $extraArgs
    return $true
  }
  return $false
}

function Install-VSBuildTools {
  # Try winget first (with VS installer overrides for C++ workload + SDK)
  if (Install-WithWinget "Microsoft.VisualStudio.2022.BuildTools" "--override `"--add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.Windows11SDK.22621 --includeRecommended --passive --norestart`"") { return }
  # Fallback: direct download and install silently
  $vsUrl = "https://aka.ms/vs/17/release/vs_BuildTools.exe"
  $vsExe = "vs_BuildTools.exe"
  Write-Host "⬇️  Downloading Visual Studio Build Tools..." -ForegroundColor Yellow
  Invoke-WebRequest $vsUrl -OutFile $vsExe
  $args = "--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.Windows11SDK.22621 --includeRecommended"
  Start-Process ".\${vsExe}" -ArgumentList $args -Wait
  Remove-Item $vsExe -Force
}

function Install-WebView2 {
  if (Install-WithWinget "Microsoft.EdgeWebView2Runtime") { return }
  # Fallback: Evergreen Runtime (x64)
  $wvUrl = "https://go.microsoft.com/fwlink/p/?LinkId=2124703"
  $wvExe = "MicrosoftEdgeWebview2Setup.exe"
  Write-Host "⬇️  Downloading WebView2 Runtime..." -ForegroundColor Yellow
  Invoke-WebRequest $wvUrl -OutFile $wvExe
  Start-Process ".\${wvExe}" -ArgumentList "/install /silent /norestart" -Wait
  Remove-Item $wvExe -Force
}

function Install-Rust {
  if (Has-Command "cargo") {
    Write-Host "✅ Rust already installed." -ForegroundColor Green
    return
  }
  if (Install-WithWinget "Rustlang.Rustup") { return }
  # Fallback: 64-bit rustup
  $rustUrl = "https://win.rustup.rs/x86_64"
  Write-Host "⬇️  Downloading Rust (64-bit)..." -ForegroundColor Yellow
  Invoke-WebRequest $rustUrl -OutFile "rustup-init.exe"
  Start-Process ".\rustup-init.exe" -ArgumentList "-y" -Wait -NoNewWindow
  Remove-Item "rustup-init.exe" -Force
  # Make sure cargo bin is on PATH for this session
  $cargoBin = "$env:USERPROFILE\.cargo\bin"
  if (-not ($env:Path -like "*$cargoBin*")) {
    [Environment]::SetEnvironmentVariable("Path", $env:Path + ";" + $cargoBin, "User")
    $env:Path = $env:Path + ";" + $cargoBin
  }
}

function Install-Node {
  if (Has-Command "node") {
    Write-Host "✅ Node.js already installed." -ForegroundColor Green
    return
  }
  if (Install-WithWinget "OpenJS.NodeJS.LTS") { return }
  # Fallback: MSI direct
  $nodeMsi = "node-v18.18.2-x64.msi"
  $nodeUrl = "https://nodejs.org/dist/v18.18.2/$nodeMsi"
  Write-Host "⬇️  Downloading Node.js LTS..." -ForegroundColor Yellow
  Invoke-WebRequest $nodeUrl -OutFile $nodeMsi
  Start-Process "msiexec.exe" -ArgumentList "/i $nodeMsi /qn" -Wait
  Remove-Item $nodeMsi -Force
}

function Ensure-pnpm {
  if (Has-Command "pnpm") {
    Write-Host "✅ pnpm already installed." -ForegroundColor Green
  } else {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
  }
}

function Ensure-TauriCLI {
  # Use Node CLI inside the project (recommended)
  if (-not (Test-Path "package.json")) { return }
  $pkg = Get-Content package.json | Out-String | ConvertFrom-Json
  if (-not $pkg.devDependencies."@tauri-apps/cli") {
    Write-Host "🛠 Adding @tauri-apps/cli to devDependencies..." -ForegroundColor Yellow
    pnpm add -D @tauri-apps/cli
  } else {
    Write-Host "✅ @tauri-apps/cli already present." -ForegroundColor Green
  }
}

# ---- Run all steps ----
Ensure-Admin

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "🔧 Installing Windows prerequisites (one-time)" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

Install-VSBuildTools
Install-WebView2
Install-Rust
rustup target add x86_64-pc-windows-msvc

Install-Node
Ensure-pnpm
Ensure-TauriCLI

Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "▶ To run in dev:     pnpm tauri dev" -ForegroundColor Yellow
Write-Host "📦 To build release:  pnpm tauri build" -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan
