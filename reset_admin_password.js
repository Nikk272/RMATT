const { db } = require('./backend/config/db');
const bcrypt = require('bcryptjs');

console.log('--- Resetting Admin Password ---');
try {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const info = db.prepare("UPDATE users SET password = ? WHERE email = 'admin@example.com'").run(hashedPassword);
    console.log(`Updated ${info.changes} rows.`);
    console.log('Admin password set to: admin123');
} catch (error) {
    console.error('Error resetting password:', error.message);
}
