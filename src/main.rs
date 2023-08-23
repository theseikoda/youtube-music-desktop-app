// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord_presence::DiscordPresence;
use tauri::Manager;

use crate::song::on_new_song_playing;

mod discord_presence;
mod song;

#[tokio::main]
async fn main() {
    let mut discord_presence = DiscordPresence::new(1105865495875424376);
    _ = discord_presence.start();

    tauri::Builder::default()
        .manage(discord_presence)
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            let script_bytes = include_bytes!("script.js");

            window
                .eval(String::from_utf8_lossy(script_bytes).to_string().as_str())
                .expect("Failed to inject script");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![on_new_song_playing])
        .run(tauri::generate_context!())
        .expect("error running tauri app");
}
