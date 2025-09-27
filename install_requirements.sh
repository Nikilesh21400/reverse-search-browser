#!/bin/bash

echo "🔧 Setting up ReverseSearch Browser environment..."

# Detect platform
OS="$(uname -s)"

install_rust() {
  if ! command -v cargo &> /dev/null; then
    echo "Installing Rust..."
    curl https://sh.rustup.rs -sSf | sh -s -- -y
    source $HOME/.cargo/env
  else
    echo "Rust is already installed ✅"
  fi
}

install_node() {
  if ! command -v pnpm &> /dev/null; then
    echo "Installing Node.js + pnpm..."
    npm install -g pnpm
  else
    echo "pnpm already installed ✅"
  fi
}

setup_tauri() {
  echo "Installing Tauri prerequisites..."
  cargo install create-tauri-app || true
  rustup target add x86_64-apple-darwin 2>/dev/null || true
  rustup target add x86_64-pc-windows-msvc 2>/dev/null || true
}

echo "🖥 Detected OS: $OS"

case "$OS" in
  Linux*)
    sudo apt update
    sudo apt install -y libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev squashfs-tools
    install_rust
    install_node
    setup_tauri
    ;;
  Darwin*)
    # macOS
    brew install webkit2gtk || true
    install_rust
    install_node
    setup_tauri
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    echo "Windows detected."
    choco install -y nodejs pnpm rustup.install
    rustup target add x86_64-pc-windows-msvc
    install_rust
    setup_tauri
    ;;
  *)
    echo "Unsupported OS. Please install Rust, pnpm, and Tauri manually."
    exit 1
    ;;
esac

echo "✅ Environment setup complete. Now run: pnpm install && pnpm tauri dev"
