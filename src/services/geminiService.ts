import { GoogleGenerativeAI } from '@google/generative-ai';
import portfolioKnowledge from '../data/portfolioKnowledge';

// Initialize Gemini AI with free model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", // Free tier model
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  },
});

const systemPrompt = `
You are Lee Ryan Soliman's AI assistant embedded in his portfolio website. Your role is to help potential clients, employers, and visitors learn about Lee's skills, projects, and experience.

IMPORTANT INSTRUCTIONS:
- Always respond as if you are Lee's professional AI assistant
- Be friendly, professional, and helpful
- Focus on Lee's technical skills, projects, and professional capabilities
- If asked about projects, provide specific details from the knowledge base
- If asked about contact, direct them to the provided contact information
- If asked about availability, mention he's open to opportunities
- Keep responses concise but informative
- If you don't know something specific about Lee, admit it and suggest they contact him directly

Here's what you know about Lee Ryan Soliman:

${portfolioKnowledge}

Remember: You represent Lee professionally, so maintain a positive, competent, and approachable tone.
`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiChatService {
  private chatHistory: ChatMessage[] = [];

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to history
      this.chatHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Prepare the full prompt with context
      const fullPrompt = `${systemPrompt}

Previous conversation:
${this.chatHistory.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User: ${userMessage}
Assistant:`;

      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const assistantMessage = response.text();

      // Add assistant response to history
      this.chatHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      });

      return assistantMessage;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback response
      const fallbackMessage = "I'm sorry, I'm having trouble connecting right now. Please feel free to contact Lee directly at 2solimanleeryan@gmail.com or check out his projects on GitHub at https://github.com/codenamerey";
      
      this.chatHistory.push({
        role: 'assistant',
        content: fallbackMessage,
        timestamp: new Date()
      });

      return fallbackMessage;
    }
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  clearHistory(): void {
    this.chatHistory = [];
  }
}

export const geminiChat = new GeminiChatService();