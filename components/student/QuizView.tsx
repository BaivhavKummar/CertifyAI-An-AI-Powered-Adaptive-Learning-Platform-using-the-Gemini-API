
import React, { useState } from 'react';
import { Topic, Question, QuestionType } from '../../types';
import Button from '../shared/Button';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from '../icons/Icons';

interface QuizViewProps {
  topic: Topic;
  questions: Question[];
  onComplete: (newMastery: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ topic, questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    setIsAnswered(true);
    setShowExplanation(true);
    if (selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const newMastery = Math.round((score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)) / questions.length * 100);
      onComplete(Math.max(topic.mastery, newMastery)); // Don't decrease mastery
    }
  };

  if (!currentQuestion) {
    return <div>Loading questions...</div>;
  }
  
  const isCorrect = selectedAnswer?.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-blue-300">{topic.name} Quiz</h2>
            <span className="text-gray-400 font-mono">
                {currentQuestionIndex + 1} / {questions.length}
            </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-2xl font-semibold text-white">{currentQuestion.questionText}</p>
      </div>

      <div className="my-8 space-y-4">
        {currentQuestion.questionType === QuestionType.MCQ && currentQuestion.options?.map((option, index) => {
          const isSelected = selectedAnswer === option;
          let buttonClass = 'bg-gray-700 hover:bg-gray-600';
          if (isAnswered) {
            if (option === currentQuestion.correctAnswer) {
              buttonClass = 'bg-green-500/50 border-2 border-green-500';
            } else if (isSelected && !isCorrect) {
              buttonClass = 'bg-red-500/50 border-2 border-red-500';
            } else {
                buttonClass = 'bg-gray-700 opacity-50';
            }
          }
          return (
            <button
              key={index}
              onClick={() => !isAnswered && setSelectedAnswer(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg text-lg transition-all duration-200 ${buttonClass} ${isSelected && !isAnswered ? 'ring-2 ring-blue-400' : ''}`}
            >
              {option}
            </button>
          )
        })}
        {currentQuestion.questionType === QuestionType.ShortAnswer && (
            <input 
                type="text"
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={isAnswered}
                className="w-full p-4 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                placeholder="Type your answer here..."
            />
        )}
      </div>

      <div className="mt-8 text-center">
        {!isAnswered ? (
          <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null} size="lg">
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} size="lg">
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        )}
      </div>

      {showExplanation && (
        <div className={`mt-8 p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
          <div className="flex items-start">
            {isCorrect ? <CheckCircleIcon className="w-8 h-8 mr-3 text-green-400 flex-shrink-0"/> : <XCircleIcon className="w-8 h-8 mr-3 text-red-400 flex-shrink-0"/>}
            <div>
                <h3 className="text-lg font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</h3>
                {!isCorrect && <p className="text-gray-300">Correct Answer: <span className="font-semibold text-white">{currentQuestion.correctAnswer}</span></p>}
                <p className="mt-2 text-gray-400">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
