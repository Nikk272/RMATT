const { db } = require('./backend/config/db');

console.log('--- Testing Student Query ---');

try {
    const query = "SELECT a.*, u.name as author FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE 1=1 AND (target_audience IS NULL OR target_audience = 'all' OR target_audience = 'students') ORDER BY created_at DESC LIMIT 20";
    console.log('Query:', query);
    const res = db.prepare(query).all();
    console.log('Success! Result count:', res.length);
} catch (error) {
    console.error('Student Query FAILED:', error.message);
}

console.log('\n--- Testing Admin Query (Baseline) ---');
try {
    const query = "SELECT a.*, u.name as author FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE 1=1 ORDER BY created_at DESC LIMIT 20";
    console.log('Query:', query);
    const res = db.prepare(query).all();
    console.log('Success! Result count:', res.length);
} catch (error) {
    console.error('Admin Query FAILED:', error.message);
}

console.log('\n--- Checking Table Info Again ---');
const info = db.prepare("PRAGMA table_info(announcements)").all();
console.log(info);
