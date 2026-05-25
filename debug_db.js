const { db } = require('./backend/config/db');

console.log('--- Tables ---');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables.map(t => t.name));

console.log('\n--- Announcements Schema ---');
const annInfo = db.prepare("PRAGMA table_info(announcements)").all();
console.log(annInfo);

console.log('\n--- Students Schema ---');
const studInfo = db.prepare("PRAGMA table_info(students)").all();
console.log(studInfo);

console.log('\n--- Users who are students ---');
const studentUsers = db.prepare("SELECT id, name, email FROM users WHERE role = 'student'").all();
console.log(studentUsers);

console.log('\n--- Students Table Data ---');
const students = db.prepare("SELECT id, name, email FROM students").all();
console.log(students);

console.log('\n--- Checking for Orphaned Student Users ---');
studentUsers.forEach(u => {
    const s = students.find(s => s.email === u.email);
    if (!s) {
        console.log(`ORPHAN: User ${u.nmae} (${u.email}) has no student record!`);
    } else {
        console.log(`MATCH: User ${u.name} linked to Student ID ${s.id}`);
    }
});

console.log('\n--- Test Announcement Query ---');
try {
    const query = "SELECT a.*, u.name as author FROM announcements a LEFT JOIN users u ON a.created_by = u.id";
    const res = db.prepare(query).all();
    console.log('Query success, count:', res.length);
} catch (e) {
    console.error('Query failed:', e.message);
}
