const { db } = require('./backend/config/db');
const { getISTDate, getISTTime } = require('./backend/utils/timezone');

async function seed() {
    try {
        console.log('Seeding test data...');

        // 1. Ensure a project exists
        db.prepare("INSERT OR IGNORE INTO projects (id, name) VALUES (1, 'Test Project')").run();

        // 2. Ensure a center exists
        db.prepare("INSERT OR IGNORE INTO centers (id, name, project_id, location) VALUES (1, 'Test Center', 1, 'Test Location')").run();

        // 3. Ensure a batch exists
        db.prepare("INSERT OR IGNORE INTO batches (id, name, center_id) VALUES (1, 'Test Batch', 1)").run();

        // 4. Create a Trainer user
        const trainerId = 'test-trainer-id';
        db.prepare("INSERT OR IGNORE INTO users (id, name, email, role, password) VALUES (?, 'Test Trainer', 'trainer@test.com', 'trainer', 'hashed_pass')").run(trainerId);

        // 5. Create a Session happening NOW
        const today = getISTDate();
        const now = new Date();
        const startTime = new Date(now.getTime() - 5 * 60000).toTimeString().split(' ')[0].substring(0, 5); // 5 mins ago
        const endTime = new Date(now.getTime() + 55 * 60000).toTimeString().split(' ')[0].substring(0, 5); // 55 mins later

        console.log(`Creating session for ${today} from ${startTime} to ${endTime}`);

        db.prepare("INSERT INTO sessions (batch_id, date, start_time, end_time, trainer_id, created_by) VALUES (1, ?, ?, ?, ?, ?)").run(
            today, startTime, endTime, trainerId, trainerId
        );

        console.log('Seed completed successfully.');
    } catch (error) {
        console.error('Seed failed:', error);
    }
}

seed();
