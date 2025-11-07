
import React, { useState } from 'react';
import { Question, QuestionType } from '../../types';
import Button from '../shared/Button';

interface QuestionReviewProps {
  questions: Omit<Question, 'id' | 'source'>[];
}

const QuestionReview: React.FC<QuestionReviewProps> = ({ questions }) => {
    const [approvedCount, setApprovedCount] = useState(0);

    const handleApproveAll = () => {
        // In a real app, this would send the approved questions to the backend.
        setApprovedCount(questions.length);
        alert(`${questions.length} questions approved and added to the question bank!`);
    };

    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {questions.map((q, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <p className="font-bold text-white mb-2">Q{index+1}: {q.questionText}</p>
                    <div className="text-sm text-gray-300 space-y-1">
                        <p><span className="font-semibold text-gray-400">Topic:</span> {q.topic}</p>
                        <p><span className="font-semibold text-gray-400">Type:</span> {q.questionType}</p>
                        {q.questionType === QuestionType.MCQ && q.options && (
                            <div>
                                <span className="font-semibold text-gray-400">Options:</span>
                                <ul className="list-disc list-inside ml-4">
                                    {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                </ul>
                            </div>
                        )}
                        <p><span className="font-semibold text-green-400">Answer:</span> {q.correctAnswer}</p>
                        <p><span className="font-semibold text-gray-400">Explanation:</span> {q.explanation}</p>
                        <p><span className="font-semibold text-gray-400">Difficulty:</span> {q.difficulty}</p>
                    </div>
                </div>
            ))}
             <div className="sticky bottom-0 bg-gray-800 pt-4">
                <Button onClick={handleApproveAll} className="w-full" disabled={approvedCount > 0}>
                    {approvedCount > 0 ? `${approvedCount} Questions Approved` : `Approve All ${questions.length} Questions`}
                </Button>
             </div>
        </div>
    );
};

export default QuestionReview;
