const { GoogleGenerativeAI } = require('@google/generative-ai');

// Function to get initialized Gemini client instance
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Warning: GEMINI_API_KEY is not set in environment variables');
  }
  // Initialize Google Generative AI client
  const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
  return genAI;
}

module.exports = { getGeminiClient };
