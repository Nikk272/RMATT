const { db } = require('./backend/config/db');
const project_id = 1;
const today = new Date().toISOString().split('T')[0];

try {
    console.log('Testing totalCenters...');
    const totalCenters = db.prepare('SELECT COUNT(*) as count FROM centers WHERE project_id = ?').get(project_id).count;
    console.log('Total Centers:', totalCenters);

    console.log('Testing totalStates...');
    const totalStates = db.prepare('SELECT COUNT(DISTINCT state) as count FROM centers WHERE project_id = ? AND state IS NOT NULL AND state != \'\'').get(project_id).count;
    console.log('Total States:', totalStates);

    console.log('Testing totalStudents...');
    const totalStudents = db.prepare(`
        SELECT COUNT(s.id) as count 
        FROM students s 
        JOIN batches b ON s.current_batch_id = b.id 
        JOIN centers c ON b.center_id = c.id 
        WHERE c.project_id = ? AND b.status = 'ongoing'
    `).get(project_id).count;
    console.log('Total Students:', totalStudents);

    console.log('Testing totalBatches...');
    const totalBatches = db.prepare(`
        SELECT COUNT(b.id) as count 
        FROM batches b 
        JOIN centers c ON b.center_id = c.id 
        WHERE c.project_id = ? AND b.status = 'ongoing'
    `).get(project_id).count;
    console.log('Total Batches:', totalBatches);

    console.log('Testing todaySessions...');
    const todaySessions = db.prepare(`
        SELECT COUNT(s.id) as count 
        FROM sessions s 
        JOIN batches b ON s.batch_id = b.id
        JOIN centers c ON b.center_id = c.id 
        WHERE s.date = ? AND c.project_id = ? AND s.status != 'cancelled'
    `).get(today, project_id).count;
    console.log('Today Sessions:', todaySessions);

} catch (err) {
    console.error('FAILED:', err.message);
}
