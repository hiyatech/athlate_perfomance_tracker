const { GoogleGenerativeAI } = require('@google/generative-ai');

// Shared function to call Google Gemini LLM API
async function callGemini(promptText, systemInstruction = '') {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || 'You are an expert sports performance coach.'
    });

    const result = await model.generateContent(promptText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw error;
  }
}

module.exports = { callGemini };
