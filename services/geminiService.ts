
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType, Difficulty } from '../types';

const questionGenerationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            questionText: {
                type: Type.STRING,
                description: "The main text of the quiz question.",
            },
            questionType: {
                type: Type.STRING,
                enum: [QuestionType.MCQ, QuestionType.ShortAnswer],
                description: "The type of the question.",
            },
            topic: {
                type: Type.STRING,
                description: "The specific topic from the syllabus this question relates to.",
            },
            options: {
                type: Type.ARRAY,
                description: "An array of 4 strings for multiple-choice options. Required for MCQ, null for ShortAnswer.",
                items: {
                    type: Type.STRING,
                },
            },
            correctAnswer: {
                type: Type.STRING,
                description: "The correct answer. For MCQ, this must be one of the strings from the 'options' array.",
            },
            explanation: {
                type: Type.STRING,
                description: "A detailed explanation for why the correct answer is right.",
            },
            difficulty: {
                type: Type.STRING,
                enum: [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard],
                description: "The estimated difficulty level of the question.",
            },
        },
        required: ["questionText", "questionType", "topic", "correctAnswer", "explanation", "difficulty"],
    },
};


export const generateQuestionsFromSyllabus = async (
    syllabus: string,
    importance: string,
    questionRatio: string,
    numQuestions: number
): Promise<Omit<Question, 'id' | 'source'>[]> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        throw new Error("API key is not configured.");
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Based on the following syllabus, generate ${numQuestions} quiz questions.

            **Syllabus:**
            ${syllabus}

            **Key Areas of Importance:**
            ${importance}

            **Desired Question Style:**
            ${questionRatio}

            Please ensure the questions cover a range of topics from the syllabus and vary in difficulty. For Multiple Choice Questions, provide 4 distinct options, including one correct answer and three plausible distractors. For all questions, provide a correct answer and a clear explanation. Adhere strictly to the provided JSON schema for the output.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionGenerationSchema,
            },
        });

        const jsonStr = response.text.trim();
        const generatedQuestions = JSON.parse(jsonStr) as Omit<Question, 'id' | 'source'>[];
        
        // Basic validation
        if (!Array.isArray(generatedQuestions)) {
            throw new Error("API did not return a valid array of questions.");
        }

        return generatedQuestions;

    } catch (error) {
        console.error("Error generating questions with Gemini API:", error);
        throw new Error("Failed to generate questions. Please check the syllabus content and your API key.");
    }
};
