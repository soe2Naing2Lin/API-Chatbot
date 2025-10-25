import { GoogleGenAI, Chat } from "@google/genai";
import { AGENTS } from '../constants';

// This is a mock API key. In a real application, this should be handled securely.
// The environment variable will be populated by the runtime environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Store chat sessions to maintain conversation history
const chatSessions = new Map<string, Chat>();

const getChatSession = (agentId: string): Chat | null => {
    if (!ai) return null;

    if (chatSessions.has(agentId)) {
        return chatSessions.get(agentId) as Chat;
    }

    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) {
        throw new Error(`Agent with id ${agentId} not found.`);
    }

    const newChat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction: agent.systemInstruction,
        },
    });

    chatSessions.set(agentId, newChat);
    return newChat;
};

export const sendMessageToGemini = async (agentId: string, message: string): Promise<string> => {
    if (!ai) {
        // Mock response for development without an API key
        return `This is a mock response because the API key is not configured. You said: "${message}"`;
    }

    const chat = getChatSession(agentId);
    if (!chat) {
        return "Error: Could not create chat session.";
    }

    try {
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "Sorry, I encountered an error. Please try again later.";
    }
};