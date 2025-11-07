
// Fix: Manually define types for import.meta.env to resolve TypeScript errors.
// The original definitions were module-scoped due to the 'import' statement below,
// preventing them from augmenting the global `ImportMeta` type.
// By wrapping them in `declare global`, we correctly extend the global scope
// and make Vite's environment variables known to TypeScript.
declare global {
    interface ImportMetaEnv {
        readonly VITE_API_BASE_URL?: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

import { User, Topic, Question, ChatMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchWrapper(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // For generate-questions, the backend returns raw text which is a JSON string
    if (endpoint === '/generate-questions' || endpoint === '/generate-study-guide') {
        return response.json();
    }
    // For DELETE requests with no body
    if (response.status === 200 && options.method === 'DELETE') {
        return response.json().catch(() => ({}));
    }
    return response.json();
}

export const apiLogin = (username: string): Promise<User> => {
    return fetchWrapper('/login', {
        method: 'POST',
        body: JSON.stringify({ username }),
    });
};

export const fetchTopics = (): Promise<Topic[]> => {
    return fetchWrapper('/topics');
};

export const fetchQuizForTopic = (topicName: string): Promise<Question[]> => {
    return fetchWrapper(`/quiz/${encodeURIComponent(topicName)}`);
};

export const fetchAnalytics = (): Promise<any> => {
    return fetchWrapper('/analytics');
};

export const generateQuestionsFromSyllabusAPI = (
    syllabus: string,
    importance: string,
    questionRatio: string,
    numQuestions: number
): Promise<Omit<Question, 'id' | 'source'>[]> => {
    return fetchWrapper('/generate-questions', {
        method: 'POST',
        body: JSON.stringify({ syllabus, importance, questionRatio, numQuestions }),
    }).then(data => JSON.parse(data.questions));
};

export const generateStudyGuideAPI = (
    studentName: string,
    weakTopics: { topic: string; mastery: number }[]
): Promise<{ study_guide: string }> => {
    return fetchWrapper('/generate-study-guide', {
        method: 'POST',
        body: JSON.stringify({ student_name: studentName, weak_topics: weakTopics }),
    });
};

export const getAITutorResponse = async (history: ChatMessage[]): Promise<string> => {
    console.log("Sending to AI Tutor:", history);
    // This is a mock API call for demonstration purposes.
    // In a real application, this would POST the history to a backend endpoint
    // which then calls the Gemini API.
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lastUserMessage = history[history.length - 1]?.content.toLowerCase() || '';

    if (lastUserMessage.includes('hooks')) {
        return "Of course! Hooks are functions that let you 'hook into' React state and lifecycle features from function components. The most common ones are `useState` for managing state, and `useEffect` for handling side effects like data fetching. What would you like to know more about them?";
    }
    if (lastUserMessage.includes('props')) {
        return "Great question! 'Props' is short for properties. They are read-only objects used to pass data from a parent component down to a child component. This is how you make components reusable and dynamic. For example, you could have a `<Button>` component and pass it a `color` prop like `<Button color='blue' />`.";
    }
     if (lastUserMessage.includes('state')) {
        return "State is a built-in React object that is used to contain data or information about the component. A component's state can change over time; whenever it changes, the component re-renders. `useState` is the hook you use to add state to a function component.";
    }

    return "That's an interesting question! Tell me more about what you're finding confusing, and I'll do my best to explain it in a simple way.";
};


// --- New functions for Question Bank Management ---

export const fetchQuestionBank = (): Promise<Question[]> => {
    return fetchWrapper('/question-bank');
};

export const updateQuestionAPI = (question: Question): Promise<Question> => {
    return fetchWrapper(`/question/${question.id}`, {
        method: 'PUT',
        body: JSON.stringify(question),
    });
};

export const deleteQuestionAPI = (questionId: string): Promise<{ message: string }> => {
    return fetchWrapper(`/question/${questionId}`, {
        method: 'DELETE',
    });
};
