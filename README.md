# 🚀 ReverseSearch Browser

A fast, secure, and lightweight browser built using **Tauri + React + Zustand + TailwindCSS** — designed to be India's own Chrome alternative.

---

## 📦 Features

- ✅ Tabbed browsing
- ✅ Address bar + navigation
- ✅ Search engine selection (ReverseSearch, Google, Bing)
- ✅ Bookmarks & history (with incognito support)
- ✅ Downloads manager
- ✅ Zen Mode (distraction-free)
- ✅ Omnibox overlay (Ctrl+K)
- ✅ Chrome-style shortcuts
- ✅ Shortcuts help panel
- ✅ Auto-update support (Tauri native)

---

## 🖥️ Local Setup Instructions

### ⚙️ Prerequisites

- **Rust** (via rustup)
- **pnpm** (via npm or install script)
- **Tauri CLI**

You can run one of the install scripts based on your platform:

### 🐧 macOS / Linux:

```bash
chmod +x install_requirements.sh
./install_requirements.sh
```

### 🪟 Windows:

Double-click `setup_windows.bat`

---

pnpm dlx tauri signer generate ### Generate Signature

Your secret key was generated successfully - Keep it secret!
dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5RjR0eklTMlZ0Tm01UkJYTXNOOUZHRDFBZzJ6RjZWa2NJQTJrdjkzbi9RWUFBQkFBQUFBQUFBQUFBQUlBQUFBQVhHTjRCMVNXZzM3aitJbDA4MytqUUlBcmNxR1V2TXJzOXplUWorTGxCTFYzbGU3am9KWkFYVkxXOFNVck1HcG1zTzRVd29vOEtmVjZmVituWWg2bUlOR0R4d1lMSDlrcFdjVWNIekQrQU1TUVptRDR3SUNhVTViOXJGQURMenY3YVpMYi85MjVNS2s9Cg==


Your public key was generated successfully:
dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDI2QTc2MDFFMUEyODYyMTcKUldRWFlpZ2FIbUNuSmtsbllsNXZRak1ZREp1YzNkcUVxWkdTNlhPQ25xbnNlanRJSXBxQ01BT04K

Add the public key in your tauri.conf.json
---------------------------

## ▶️ Run in Development

```bash
pnpm install
pnpm add -D @tauri-apps/cli
pnpm add @tauri-apps/plugin-updater
pnpm add @tauri-apps/plugin-store

cd src-tauri
cargo clean
cargo build

cd..
pnpm build
pnpm tauri dev
```

---

## 🛠 Build Installers

```bash
pnpm build
pnpm tauri build
```

Outputs:
- Windows: `.msi` or `.exe`
- macOS: `.app`
- Linux: `.AppImage`, `.deb`

---

## 🔄 Auto-Updater

To enable auto-updating:
1. Generate keypair:
```bash
pnpm dlx tauri signer generate
```
2. Host your `.zip` and `.json` manifest
3. Paste public key in `tauri.conf.json` under `updater.pubkey`
4. On new release:
```bash
pnpm dlx tauri signer sign --private-key private.pem --update-json
```

---

## 💡 Keyboard Shortcuts

| Shortcut       | Action              |
|----------------|---------------------|
| `Ctrl + T`     | New tab             |
| `Ctrl + W`     | Close tab           |
| `Ctrl + R`     | Reload current tab  |
| `Ctrl + 1–9`   | Jump to tab index   |
| `Ctrl + Z`     | Toggle Zen Mode     |
| `Ctrl + I`     | Toggle Incognito    |
| `Ctrl + K`     | Open Omnibox        |
| `Esc`          | Close overlays      |

---

## 👨‍💻 Contributing

1. Fork this repo
2. Create a branch
3. Commit & push your feature
4. Open a PR 🎉

---

## 🧠 Creator

Made by Nikilesh — built to give India its own browser.

Visit: [https://reversesearch.co.in](https://reversesearch.co.in)

