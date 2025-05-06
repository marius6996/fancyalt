//routes/status.js
//this route provides a health check endpoint at /api/status
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
