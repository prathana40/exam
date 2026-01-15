 const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // or use global fetch in Node 18+

// POST /api/ai/gemini
router.post('/api/ai/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await fetch('https://api.gemini.example.com/v1/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json({ result: data });

    } catch (err) {
        console.error('Error calling Gemini:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
