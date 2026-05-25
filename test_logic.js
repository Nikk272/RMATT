const { db } = require('./backend/config/db');
const { getISTDate, getISTTime, isWithinGracePeriod } = require('./backend/utils/timezone');

function test() {
    try {
        const user = { id: 'test-trainer-id', role: 'trainer' };
        const today = getISTDate();

        console.log('Testing Trainer Discovery for user:', user.id, 'on date:', today);

        const sessions = db.prepare(`
            SELECT DISTINCT s.id, s.start_time, s.end_time, s.date 
            FROM sessions s
            JOIN batches b ON s.batch_id = b.id
            LEFT JOIN trainer_assignments ta ON b.id = ta.batch_id
            WHERE (s.trainer_id = ? OR ta.user_id = ? OR b.default_trainer_id = ?) 
              AND s.date = ? AND s.status != 'cancelled'
        `).all(user.id, user.id, user.id, today);

        console.log('Found Sessions:', sessions.length);

        const graceMins = 15;
        const activeIds = sessions
            .filter(s => {
                const active = isWithinGracePeriod(s.date, s.start_time, s.end_time, graceMins);
                console.log(`Checking Session ${s.id} (${s.start_time}-${s.end_time}): ${active}`);
                return active;
            })
            .map(s => s.id);

        console.log('Active Session IDs:', activeIds);
    } catch (error) {
        console.error('Logic FAILED with error:', error);
    }
}

test();
