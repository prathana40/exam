 // controllers/aiController.js
const fetch = require('node-fetch'); // or global fetch in Node 18+

/**
 * Calls Gemini API with a given prompt
 * @param {string} prompt - User prompt to send to Gemini
 * @returns {Promise<Object>} - Gemini API response
 */
async function callGemini(prompt) {
    if (!prompt) throw new Error('Prompt is required');

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
        throw new Error(`Gemini API error: ${errorText}`);
    }

    return await response.json();
}

/**
 * Express handler for POST /api/ai/gemini
 */
async function handleGeminiRequest(req, res) {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await callGemini(prompt);
        res.json({ result });
    } catch (err) {
        console.error('AI Controller Error:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}

module.exports = {
    handleGeminiRequest,
    callGemini
};
