// src/controllers/actionItemController.js
const prisma = require('../utils/db');
const { sendSuccess, sendError } = require('../utils/response');
const redis = require('redis');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(() => console.log('⚠️ Redis not running locally. Caching bypassed.'));

// POST /api/action-items
const createActionItem = async (req, res, next) => {
    try {
        const { meetingId, task, assignee, dueDate } = req.body;

        if (!meetingId || !task || !assignee || !dueDate) {
            return sendError(res, req, 400, 'VALIDATION_ERROR', 'Missing required fields.');
        }

        const actionItem = await prisma.actionItem.create({
            data: {
                meetingId,
                task,
                assignee,
                dueDate: new Date(dueDate)
            }
        });

        return sendSuccess(res, req, actionItem);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/action-items/:id/status
const updateActionItemStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'IN PROGRESS', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            return sendError(res, req, 400, 'VALIDATION_ERROR', 'Invalid status. Must be PENDING, IN PROGRESS, or COMPLETED.');
        }

        const actionItem = await prisma.actionItem.update({
            where: { id },
            data: { status }
        });

        return sendSuccess(res, req, actionItem);
    } catch (error) {
        // Prisma throws a specific error if the record to update isn't found
        if (error.code === 'P2025') {
            return sendError(res, req, 404, 'NOT_FOUND', 'Action item not found');
        }
        next(error);
    }
};


// GET /api/action-items
const listActionItems = async (req, res, next) => {
    try {
        const { status, assignee, meetingId } = req.query;

        // 1. Create a unique cache key based on the user's search filters
        const cacheKey = `actionItems:${status || 'all'}:${assignee || 'all'}:${meetingId || 'all'}`;

        // 2. Check if we have this exact data saved in Redis
        if (redisClient.isReady) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log(`🚀 Cache HIT for key: ${cacheKey}`);
                // Return the cached data instantly! No database needed.
                return sendSuccess(res, req, JSON.parse(cachedData));
            }
        }

        // 3. If not in cache, do the heavy lifting with the Database
        const filter = {};
        if (status) filter.status = status;
        if (assignee) filter.assignee = assignee;
        if (meetingId) filter.meetingId = meetingId;

        const actionItems = await prisma.actionItem.findMany({
            where: filter,
            orderBy: { dueDate: 'asc' }
        });

        // 4. Save the answer in Redis for 1 hour (3600 seconds) for the next person
        if (redisClient.isReady) {
            console.log(`🐢 Cache MISS. Saving data to Redis for key: ${cacheKey}`);
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(actionItems));
        }

        return sendSuccess(res, req, actionItems);
    } catch (error) {
        next(error);
    }
};

// GET /api/action-items/overdue
const getOverdueActionItems = async (req, res, next) => {
    try {
        const overdueItems = await prisma.actionItem.findMany({
            where: {
                status: { not: 'COMPLETED' },
                dueDate: { lt: new Date() }
            },
            orderBy: { dueDate: 'asc' }
        });

        return sendSuccess(res, req, overdueItems);
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    createActionItem, 
    updateActionItemStatus, 
    listActionItems, 
    getOverdueActionItems 
};