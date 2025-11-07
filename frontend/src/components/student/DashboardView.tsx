import React from 'react';
import { Topic } from '../../types';
import LearningPath from './LearningPath';

interface DashboardViewProps {
    topics: Topic[];
    currentTopic: Topic | undefined;
    onStartQuiz: () => void;
    isQuizLoading: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ topics, currentTopic, onStartQuiz, isQuizLoading }) => {
    return (
        <>
            <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white">Your Learning Journey</h2>
                <p className="mt-2 text-gray-400">
                {currentTopic
                    ? `Your next topic is: ${currentTopic.name}. Keep up the great work!`
                    : "Congratulations! You've mastered all topics."}
                </p>
            </div>
            <LearningPath topics={topics} currentTopicId={currentTopic?.id} />
            <div className="mt-8 text-center">
                {currentTopic ? (
                <button 
                    onClick={onStartQuiz}
                    disabled={isQuizLoading}
                    className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isQuizLoading ? 'Loading Quiz...' : `Start Quiz on "${currentTopic.name}"`}
                </button>
                ) : (
                    <div className="text-xl font-semibold text-green-400">All Topics Mastered!</div>
                )}
            </div>
        </>
    );
};

export default DashboardView;
