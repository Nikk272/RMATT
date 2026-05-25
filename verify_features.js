async function verify() {
    const studentEmail = 'student@example.com';
    const password = 'password123';
    const baseUrl = 'http://localhost:5000/api';

    try {
        console.log('--- Logging in ---');
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: studentEmail, password })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(`Login failed: ${loginData.message}`);

        const token = loginData.token;
        const studentId = loginData.user.student_id;
        console.log(`Log in successful. Student ID: ${studentId}`);

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        console.log('\n--- Testing Upcoming Sessions ---');
        const sessionsRes = await fetch(`${baseUrl}/sessions/upcoming/${studentId}`, { headers });
        const sessionsData = await sessionsRes.json();
        console.log(`Found ${sessionsData.length} upcoming sessions.`);
        if (sessionsData.length > 0) {
            console.log('Latest Session:', sessionsData[0].date, sessionsData[0].start_time);
        }

        console.log('\n--- Testing Announcements Unread Count ---');
        const unreadCountRes = await fetch(`${baseUrl}/communication/announcements/unread-count`, { headers });
        const unreadCountData = await unreadCountRes.json();
        console.log(`Unread Count: ${unreadCountData.count}`);

        console.log('\n--- Testing List Announcements ---');
        const announcementsRes = await fetch(`${baseUrl}/communication/announcements`, { headers });
        const announcementsData = await announcementsRes.json();
        console.log(`Total Announcements fetched: ${announcementsData.length}`);

        const firstAnnouncement = announcementsData[0];

        if (firstAnnouncement) {
            console.log(`First Announcement: ID=${firstAnnouncement.id}, Title="${firstAnnouncement.title}", Is Read=${firstAnnouncement.is_read}`);

            if (firstAnnouncement.is_read === 0) {
                console.log('\n--- Marking as Read ---');
                await fetch(`${baseUrl}/communication/announcements/${firstAnnouncement.id}/read`, {
                    method: 'POST',
                    headers
                });
                console.log('Marked as read.');

                console.log('\n--- Verifying Unread Count Change ---');
                const newUnreadCountRes = await fetch(`${baseUrl}/communication/announcements/unread-count`, { headers });
                const newUnreadCountData = await newUnreadCountRes.json();
                console.log(`New Unread Count: ${newUnreadCountData.count}`);

                if (newUnreadCountData.count < unreadCountData.count) {
                    console.log('✅ Unread count decreased successfully.');
                } else {
                    console.log('❌ Unread count did NOT decrease.');
                }
            } else {
                console.log('First announcement is already read, skipping mark-as-read test.');
            }
        } else {
            console.log('No announcements found to test.');
        }

        console.log('\n--- SUCCESS: API Verification Complete ---');
    } catch (error) {
        console.error('Verification failed:', error.message);
        process.exit(1);
    }
}

verify();
