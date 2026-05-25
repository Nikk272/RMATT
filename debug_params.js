const { db } = require('./backend/config/db');

console.log('--- Testing query with .all([]) ---');
try {
    const query = "SELECT * FROM announcements LIMIT 1";
    console.log('Query:', query);
    // This is what the controller does:
    const res = db.prepare(query).all([]);
    console.log('Success with .all([]):', res.length);
} catch (error) {
    console.error('FAILED with .all([]):', error.message);
}

console.log('\n--- Testing query with .all(...[]) ---');
try {
    const query = "SELECT * FROM announcements LIMIT 1";
    // This is what it should probably be:
    const res = db.prepare(query).all(...[]);
    console.log('Success with .all(...[]):', res.length);
} catch (error) {
    console.error('FAILED with .all(...[]):', error.message);
}
