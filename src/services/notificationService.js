// src/services/notificationService.js

const sendSlackReminder = async (actionItem) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
        console.warn('SLACK_WEBHOOK_URL is not defined in .env. Skipping notification.');
        return;
    }

    // Format the message
    const message = {
        text: `⚠️ *Overdue Action Item Reminder* ⚠️\n*Task:* ${actionItem.task}\n*Assigned To:* ${actionItem.assignee}\n*Due Date:* ${actionItem.dueDate.toDateString()}`
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            console.error('Failed to send Slack notification:', response.statusText);
        } else {
            console.log(`[SUCCESS] Reminder sent for Action Item ID: ${actionItem.id}`);
        }
    } catch (error) {
        console.error('Error sending Slack notification:', error);
    }
};

module.exports = { sendSlackReminder };