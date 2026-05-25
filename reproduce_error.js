const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'backend/attendance.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

async function test() {
    console.log('Testing Admin creation with empty string center_id...');
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const name = 'Test Admin';
        const email = 'testadmin' + Date.now() + '@example.com';
        const role = 'admin';
        const center_id = ''; // This is what the frontend sends if it's a hidden select

        const stmt = db.prepare('INSERT INTO users (name, email, password, role, center_id) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(name, email, hashedPassword, role, center_id);
        console.log('Success!', info);
    } catch (error) {
        console.error('Error caught:', error.message);
        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            console.log('Hypothesis confirmed: Foreign key constraint failed for empty string.');
        }
    }
}

test();
