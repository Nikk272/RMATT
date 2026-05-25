const { db } = require('./backend/config/db');

console.log('--- Starting Migration ---');

// 1. Add target_audience to announcements if missing
try {
    const info = db.prepare("PRAGMA table_info(announcements)").all();
    const hasColumn = info.some(c => c.name === 'target_audience');

    if (!hasColumn) {
        console.log('Adding target_audience column to announcements...');
        db.prepare("ALTER TABLE announcements ADD COLUMN target_audience TEXT DEFAULT 'all'").run();
        console.log('Column added successfully.');
    } else {
        console.log('target_audience column already exists.');
    }
} catch (error) {
    console.error('Error migrating announcements:', error.message);
}

// 2. Create missing student records
try {
    const studentUsers = db.prepare("SELECT id, name, email FROM users WHERE role = 'student'").all();
    const existingStudents = db.prepare("SELECT email FROM students").all().map(s => s.email);

    let createdCount = 0;

    studentUsers.forEach(user => {
        if (!existingStudents.includes(user.email)) {
            console.log(`Creating missing student record for ${user.email}...`);
            db.prepare("INSERT INTO students (name, email) VALUES (?, ?)").run(user.name, user.email);
            createdCount++;
        }
    });

    console.log(`Created ${createdCount} missing student records.`);

} catch (error) {
    console.error('Error syncing students:', error.message);
}

console.log('--- Migration Complete ---');
