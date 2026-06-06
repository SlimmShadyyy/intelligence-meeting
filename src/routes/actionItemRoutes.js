// src/routes/actionItemRoutes.js
const express = require('express');
const { 
    createActionItem, 
    updateActionItemStatus, 
    listActionItems, 
    getOverdueActionItems 
} = require('../controllers/actionItemController');

const router = express.Router();

router.get('/overdue', getOverdueActionItems);

router.post('/', createActionItem);
router.get('/', listActionItems);
router.patch('/:id/status', updateActionItemStatus);

module.exports = router;