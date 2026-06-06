// src/services/aiService.js
const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analyzeTranscriptWithAI = async (transcriptArray) => {
    // Format transcript into a readable block of text
    const formattedTranscript = transcriptArray
        .map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
        .join('\n');

    const prompt = `
    You are an expert AI meeting assistant. Analyze the following transcript.
    
    You MUST adhere strictly to these rules to ensure accurate grounding:
    1. NEVER invent attendees, tasks, decisions, or outcomes. Only use explicit data from the transcript.
    2. Every single extracted item MUST include an array of exact timestamps ("citations") where that information was spoken.
    
    Return ONLY a valid JSON object matching this exact schema:
    {
      "summary": [{ "text": "string", "citations": ["00:10"] }],
      "actionItems": [{ "task": "string", "assignee": "string", "citations": ["00:20"] }],
      "decisions": [{ "text": "string", "citations": ["00:10"] }],
      "followUpSuggestions": [{ "text": "string", "citations": ["00:20"] }]
    }

    Transcript:
    ${formattedTranscript}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // Force the model to return valid JSON
                responseMimeType: "application/json",
                // Temperature 0.0 minimizes hallucinations and maximizes strict factual grounding
                temperature: 0.0, 
            }
        });

        // The SDK returns the raw JSON string in response.text
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to analyze transcript with AI.");
    }
};

module.exports = { analyzeTranscriptWithAI };