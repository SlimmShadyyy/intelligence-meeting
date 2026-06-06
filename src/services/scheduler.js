// src/services/scheduler.js
const cron = require('node-cron');
const prisma = require('../utils/db');
const { sendSlackReminder } = require('./notificationService');

const startScheduler = () => {
    // '* * * * *' runs every single minute for testing purposes.
    // Before submitting the assignment, change this to '0 9 * * *' to run once a day!
    cron.schedule('0 9 * * *', async () => {
        console.log('Running scheduled overdue action item check...');

        try {
            // 1. Identify overdue action items
            const overdueItems = await prisma.actionItem.findMany({
                where: {
                    status: { not: 'COMPLETED' },
                    dueDate: { lt: new Date() }
                }
            });

            if (overdueItems.length === 0) {
                console.log('No overdue items found.');
                return;
            }

            // 2. Trigger reminder notifications
            for (const item of overdueItems) {
                await sendSlackReminder(item);
                // 3. Record reminder history (Requirement 7.3)
                console.log(`[HISTORY] Reminder triggered for task: ${item.task} to ${item.assignee}`);
            }

        } catch (error) {
            console.error('Error in scheduler job:', error);
        }
    });

    console.log('Background scheduler initialized.');
};

module.exports = { startScheduler };