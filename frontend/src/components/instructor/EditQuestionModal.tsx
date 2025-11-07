
import React, { useState, useEffect } from 'react';
import { Question, QuestionType, Difficulty } from '../../types';
import Button from '../shared/Button';
import { XCircleIcon } from '../icons/Icons';

interface EditQuestionModalProps {
    question: Question;
    onSave: (question: Question) => void;
    onClose: () => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ question, onSave, onClose }) => {
    const [formData, setFormData] = useState<Question>(question);
    
    useEffect(() => {
        setFormData(question);
    }, [question]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(formData.options || [])];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Question</h2>
                    <button onClick={onClose} aria-label="Close modal">
                        <XCircleIcon className="w-8 h-8 text-gray-500 hover:text-white"/>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="questionText" className="block text-sm font-medium text-gray-300">Question Text</label>
                        <textarea id="questionText" name="questionText" value={formData.questionText} onChange={handleChange} rows={3} required className="mt-1 w-full p-2 bg-gray-700 rounded-md border border-gray-600"/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-300">Topic</label>
                            <input type="text" id="topic" name="topic" value={formData.topic} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-700 rounded-md border border-gray-600"/>
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">Difficulty</label>
                            <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-700 rounded-md border border-gray-600">
                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="questionType" className="block text-sm font-medium text-gray-300">Question Type</label>
                            <select id="questionType" name="questionType" value={formData.questionType} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-700 rounded-md border border-gray-600" disabled>
                                {Object.values(QuestionType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {formData.questionType === QuestionType.MCQ && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Options</label>
                            <div className="space-y-2 mt-1">
                                {formData.options?.map((option, index) => (
                                    <input key={index} type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"/>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-300">Correct Answer</label>
                         <input type="text" id="correctAnswer" name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-700 rounded-md border border-gray-600"/>
                    </div>
                    
                     <div>
                        <label htmlFor="explanation" className="block text-sm font-medium text-gray-300">Explanation</label>
                        <textarea id="explanation" name="explanation" value={formData.explanation} onChange={handleChange} rows={3} required className="mt-1 w-full p-2 bg-gray-700 rounded-md border border-gray-600"/>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditQuestionModal;
