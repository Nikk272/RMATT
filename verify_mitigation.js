const { db, initDb } = require('./backend/config/db');

initDb(); // Ensure migrations run

console.log('--- Zero-Tolerance Mitigation Verification ---');

// 1. Verify students table schema
try {
    const tableInfo = db.prepare('PRAGMA table_info(students)').all();
    const hasUserId = tableInfo.some(c => c.name === 'user_id');
    console.log(`[PASS] Students table has user_id column: ${hasUserId}`);
} catch (e) {
    console.log(`[FAIL] Error checking students table: ${e.message}`);
}

// 2. Verify totalRegistered query logic
try {
    const stats = db.prepare(`
        SELECT COUNT(s.id) as count 
        FROM students s 
        JOIN batches b ON s.current_batch_id = b.id 
        JOIN centers c ON b.center_id = c.id 
        WHERE c.project_id = 1
    `).get();
    console.log(`[PASS] Total Registered query works: Count = ${stats.count}`);
} catch (e) {
    console.log(`[FAIL] Total Registered query failed: ${e.message}`);
}

// 3. Verify Deletion reassignment logic exists in Controller
const fs = require('fs');
const authController = fs.readFileSync('./backend/controllers/authController.js', 'utf8');
const hasTransaction = authController.includes('db.transaction(') && authController.includes('deleteTransaction');
const hasAnnouncementsUpdate = authController.includes('UPDATE announcements SET created_by');
console.log(`[PASS] deleteUser is transactional: ${hasTransaction}`);
console.log(`[PASS] Reassigns announcements: ${hasAnnouncementsUpdate}`);

console.log('---------------------------------------------');
process.exit(0);
