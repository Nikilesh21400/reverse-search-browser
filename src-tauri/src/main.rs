#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use rusqlite::{Connection, params};
use tauri::{State, Manager};
use std::path::PathBuf;

// Alias so we don’t repeat Result<T, String>
type AppResult<T> = std::result::Result<T, String>;

struct HistoryState(Mutex<Connection>);

#[tauri::command]
fn add_history_entry(state: State<HistoryState>, url: String) -> AppResult<()> {
    let conn = state.0.lock().unwrap();
    conn.execute(
        "INSERT INTO history (url, timestamp) VALUES (?1, strftime('%s','now'))",
        params![url],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_history(state: State<HistoryState>) -> AppResult<Vec<(String, i64)>> {
    let conn = state.0.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT url, timestamp FROM history ORDER BY timestamp DESC LIMIT 100")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| Ok((row.get(0)?, row.get(1)?)))
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row.map_err(|e| e.to_string())?);
    }
    Ok(results)
}

// ✅ Always resolve DB path outside src-tauri
fn history_db_path() -> PathBuf {
    // Start at project root, not src-tauri
    let mut path = std::env::current_dir().unwrap();

    // If running in dev, current_dir may be "src-tauri" → go one level up
    if path.ends_with("src-tauri") {
        path.pop();
    }

    path.push("data");
    std::fs::create_dir_all(&path).unwrap();
    path.push("history.db");
    path
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let db_path = history_db_path();
            let conn = Connection::open(db_path).expect("failed to open db");

            conn.execute(
                "CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY,
                    url TEXT NOT NULL,
                    timestamp INTEGER NOT NULL
                )",
                [],
            )
            .unwrap();

            app.manage(HistoryState(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![add_history_entry, get_history])
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
