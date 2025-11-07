
import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { fetchQuestionBank, deleteQuestionAPI, updateQuestionAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import { PencilIcon, TrashIcon } from '../icons/Icons';
import EditQuestionModal from './EditQuestionModal';

const QuestionBankView: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchQuestionBank();
            setQuestions(data);
        } catch (err: any) {
            setError('Failed to load the question bank.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingQuestionId) return;
        try {
            await deleteQuestionAPI(deletingQuestionId);
            setQuestions(prev => prev.filter(q => q.id !== deletingQuestionId));
            setDeletingQuestionId(null);
        } catch (err) {
            setError('Failed to delete question. Please try again.');
            // Keep the modal open to show the error if needed
        }
    };
    
    const handleSave = async (updatedQuestion: Question) => {
        try {
            const savedQuestion = await updateQuestionAPI(updatedQuestion);
            setQuestions(prev => prev.map(q => q.id === savedQuestion.id ? savedQuestion : q));
            setEditingQuestion(null);
        } catch (err) {
            setError('Failed to save question. Please try again.');
            // Keep the modal open
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading Question Bank..." /></div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Question Bank Management</h2>
             {error && <div className="text-center text-red-400 mb-4 p-3 bg-red-900/50 rounded-lg">{error}</div>}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {questions.map(q => (
                    <div key={q.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                           <div>
                                <p className="font-bold text-white">{q.questionText}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Topic: <span className="font-semibold text-purple-300">{q.topic}</span> | 
                                    Difficulty: <span className="font-semibold text-purple-300">{q.difficulty}</span> |
                                    Type: <span className="font-semibold text-purple-300">{q.questionType}</span>
                                </p>
                           </div>
                           <div className="flex space-x-2 flex-shrink-0 ml-4">
                               <Button size="sm" variant="secondary" onClick={() => setEditingQuestion(q)} aria-label="Edit question">
                                   <PencilIcon className="w-4 h-4" />
                               </Button>
                               <Button size="sm" variant="danger" onClick={() => setDeletingQuestionId(q.id)} aria-label="Delete question">
                                   <TrashIcon className="w-4 h-4" />
                               </Button>
                           </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingQuestion && (
                <EditQuestionModal
                    question={editingQuestion}
                    onSave={handleSave}
                    onClose={() => setEditingQuestion(null)}
                />
            )}

            {deletingQuestionId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-lg font-bold">Confirm Deletion</h3>
                        <p className="text-gray-300 mt-2">Are you sure you want to delete this question? This action cannot be undone.</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={() => setDeletingQuestionId(null)}>Cancel</Button>
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionBankView;
