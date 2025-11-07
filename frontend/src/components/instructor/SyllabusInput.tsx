

import React, { useState } from 'react';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Question } from '../../types';
import { generateQuestionsFromSyllabusAPI } from '../../services/api';
import QuestionReview from './QuestionReview';

const SyllabusInput: React.FC = () => {
    const [syllabus, setSyllabus] = useState('');
    const [importance, setImportance] = useState('');
    const [questionRatio, setQuestionRatio] = useState('A balance of 50% practical/application and 50% theoretical/conceptual questions.');
    const [numQuestions, setNumQuestions] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedQuestions, setGeneratedQuestions] = useState<Omit<Question, 'id' | 'source'>[]>([]);

    const handleGenerate = async () => {
        if (!syllabus) {
            setError('Syllabus content cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedQuestions([]);
        try {
            const questions = await generateQuestionsFromSyllabusAPI(syllabus, importance, questionRatio, numQuestions);
            setGeneratedQuestions(questions);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg space-y-6">
                <h2 className="text-2xl font-bold">AI Question Generation</h2>
                
                <div>
                    <label htmlFor="syllabus" className="block text-sm font-medium text-gray-300 mb-2">Syllabus Content</label>
                    <textarea
                        id="syllabus"
                        rows={10}
                        className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                        placeholder="Paste your detailed syllabus here..."
                        value={syllabus}
                        onChange={(e) => setSyllabus(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="importance" className="block text-sm font-medium text-gray-300 mb-2">Importance Tagging (Optional)</label>
                    <input
                        type="text"
                        id="importance"
                        className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                        placeholder="e.g., 'React Hooks, State Management'"
                        value={importance}
                        onChange={(e) => setImportance(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="questionRatio" className="block text-sm font-medium text-gray-300 mb-2">Question Type Preference</label>
                     <select
                        id="questionRatio"
                        className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={questionRatio}
                        onChange={(e) => setQuestionRatio(e.target.value)}
                     >
                        <option>A balance of 50% practical and 50% theoretical questions.</option>
                        <option>Focus primarily on practical/application-based questions (75%).</option>
                        <option>Focus primarily on theoretical/conceptual questions (75%).</option>
                     </select>
                </div>
                
                 <div>
                    <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-300 mb-2">Number of Questions to Generate</label>
                     <input
                        type="number"
                        id="numQuestions"
                        min="1"
                        max="10"
                        className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                     />
                </div>

                <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                    {isLoading ? 'Generating...' : 'Generate Questions'}
                </Button>
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Generated Questions Review</h2>
                {isLoading && <LoadingSpinner text="Generating with Gemini..."/>}
                {!isLoading && generatedQuestions.length > 0 && <QuestionReview questions={generatedQuestions} />}
                {!isLoading && generatedQuestions.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>Generated questions will appear here for your review and approval.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SyllabusInput;
