import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const testGemini = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = "Say 'Hello, I am working!' in JSON format: { message: 'Hello, I am working!' }";
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleanJson = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const data = JSON.parse(cleanJson);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};