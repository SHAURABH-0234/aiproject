import { QuizQuestion } from '../types';

async function generateContent<T>(type: 'summary' | 'plan' | 'quiz', pdfText: string): Promise<T> {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, pdfText }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.content as T;
}

export const generateSummary = (pdfText: string): Promise<string> => {
    return generateContent<string>('summary', pdfText);
};

export const generateStudyPlan = (pdfText: string): Promise<string> => {
    return generateContent<string>('plan', pdfText);
};

export const generateQuiz = (pdfText: string): Promise<QuizQuestion[]> => {
    return generateContent<QuizQuestion[]>('quiz', pdfText);
};
