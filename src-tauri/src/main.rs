#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use rusqlite::{Connection, params};
use tauri::State;

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

fn main() {
    let conn = Connection::open("history.db").expect("failed to open db");
    conn.execute(
        "CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY,
            url TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )",
        [],
    )
    .unwrap();

    tauri::Builder::default()
        .manage(HistoryState(Mutex::new(conn)))
        .invoke_handler(tauri::generate_handler![add_history_entry, get_history])
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
