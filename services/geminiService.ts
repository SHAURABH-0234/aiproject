
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const truncateText = (text: string, maxTokens: number = 30000) => {
    // A rough approximation: 1 token ~ 4 chars. This is very conservative.
    const maxChars = maxTokens * 3; 
    if (text.length > maxChars) {
        return text.substring(0, maxChars);
    }
    return text;
};

export const generateSummary = async (pdfText: string): Promise<string> => {
  const truncatedText = truncateText(pdfText);
  const prompt = `Please provide a concise and comprehensive summary of the following document. Focus on the main ideas, key arguments, and important conclusions. The summary should be easy to understand for someone who has not read the original document. Here is the document content:\n\n${truncatedText}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

export const generateStudyPlan = async (pdfText: string): Promise<string> => {
  const truncatedText = truncateText(pdfText);
  const prompt = `Based on the content of the following document, create a detailed four-week study plan. Break down the key topics and concepts into a weekly schedule. For each week, outline the main learning objectives and suggest specific sections or ideas to focus on. Present the plan in a clear, structured format using Markdown (using '##' for week titles and '###' for daily/topic breakdown, and '*' for list items). Here is the document content:\n\n${truncatedText}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

export const generateQuiz = async (pdfText: string): Promise<QuizQuestion[]> => {
  const truncatedText = truncateText(pdfText);
  const prompt = `Generate a multiple-choice quiz with 5 questions based on the key concepts in the following document. For each question, provide four distinct options, with only one being correct. Ensure the questions cover a range of topics from the document. Here is the document content:\n\n${truncatedText}`;

  const quizSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: 'The quiz question.'
        },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'An array of 4 possible answers.'
        },
        answer: {
          type: Type.STRING,
          description: 'The correct answer, which must be one of the provided options.'
        }
      },
      required: ['question', 'options', 'answer']
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: quizSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    const quizData = JSON.parse(jsonText);
    return quizData as QuizQuestion[];
  } catch (error) {
    console.error("Failed to parse quiz JSON:", error);
    throw new Error("The AI returned an invalid quiz format. Please try again.");
  }
};
