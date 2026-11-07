use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn get_app_info() -> serde_json::Value {
    serde_json::json!({
        "name": "Amvaj Sarmad",
        "package": "com.amvajsarmad.app",
        "target_url": "https://amvajsarmad.com",
        "version": "1.0.0",
        "framework": "Tauri 2 + Android WebView",
        "django_backend": "Django 5.2 (PostgreSQL + Redis + Celery + Nginx)"
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![get_app_info])
        .setup(|_app| {
            // Native initialization hooks
            // On mobile devices, Tauri passes the native WebView handle
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Amvaj Sarmad tauri application");
}
