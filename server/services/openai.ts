import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface ChatMessage {
  role: string;
  content: string;
  timestamp?: string;
}

class OpenAIService {
  async chatWithAI(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    try {
      const systemPrompt = `You are a helpful AI health assistant for a clinic management app. You can:
- Answer general health questions
- Provide information about symptoms and conditions
- Suggest when to see a doctor
- Give general wellness advice
- Help with appointment-related questions

Important guidelines:
- Always recommend consulting a healthcare professional for serious concerns
- Do not provide specific medical diagnoses
- Keep responses helpful but not overly medical
- Be empathetic and supportive
- Suggest using the app's features when appropriate (booking appointments, finding doctors, etc.)`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...history.slice(-5).map(msg => ({ 
          role: msg.role === 'AI Assistant' ? 'assistant' : 'user', 
          content: msg.content 
        })),
        { role: "user", content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't process your request right now.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async analyzeSentiment(text: string): Promise<{
    rating: number,
    confidence: number
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }",
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{"rating": 3, "confidence": 0.5}');

      return {
        rating: Math.max(1, Math.min(5, Math.round(result.rating))),
        confidence: Math.max(0, Math.min(1, result.confidence)),
      };
    } catch (error: any) {
      console.error('Sentiment analysis error:', error);
      throw new Error("Failed to analyze sentiment: " + error.message);
    }
  }

  async summarizeText(text: string): Promise<string> {
    try {
      const prompt = `Please summarize the following text concisely while maintaining key points:\n\n${text}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      });

      return response.choices[0].message.content || "Unable to summarize text.";
    } catch (error: any) {
      console.error('Text summarization error:', error);
      throw new Error("Failed to summarize text: " + error.message);
    }
  }
}

export const openAIService = new OpenAIService();
