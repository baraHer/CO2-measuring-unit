const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error("Database connection failed: ", err);
    } else {
        console.log("Connected to SQLite!");
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS climate_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      datetime TEXT,
      carbon INTEGER,
      temperature REAL,
      humidity REAL
    )`, (err) => {
            if (err) {
                console.error("Error creating table: ", err);
            } else {
                console.log("Table 'climate_data' created or already exists.");
            }
        });
    }
});

module.exports = db;