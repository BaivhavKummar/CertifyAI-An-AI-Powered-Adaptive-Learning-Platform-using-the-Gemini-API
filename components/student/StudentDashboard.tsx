
import React, { useState, useMemo } from 'react';
import { MOCK_TOPICS, MOCK_QUESTION_BANK } from '../../constants';
import { Topic, Question } from '../../types';
import LearningPath from './LearningPath';
import QuizView from './QuizView';

const StudentDashboard: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [activeQuizTopic, setActiveQuizTopic] = useState<Topic | null>(null);

  const currentTopic = useMemo(() => {
    return topics.find(t => {
      if (t.mastery < 100) {
        const prereqsMet = t.prerequisites.every(prereqId => {
          const prereqTopic = topics.find(pt => pt.id === prereqId);
          return prereqTopic && prereqTopic.mastery === 100;
        });
        return prereqsMet;
      }
      return false;
    });
  }, [topics]);

  const handleStartQuiz = () => {
    if (currentTopic) {
      setActiveQuizTopic(currentTopic);
    }
  };

  const handleQuizComplete = (newMastery: number) => {
    if (activeQuizTopic) {
      setTopics(prevTopics =>
        prevTopics.map(t =>
          t.id === activeQuizTopic.id ? { ...t, mastery: newMastery } : t
        )
      );
    }
    setActiveQuizTopic(null);
  };
  
  const quizQuestions = useMemo(() => {
    if(!activeQuizTopic) return [];
    return MOCK_QUESTION_BANK.filter(q => q.topic === activeQuizTopic.name).slice(0, 3); // Mock 3 questions per quiz
  }, [activeQuizTopic]);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      {activeQuizTopic ? (
        <QuizView 
            topic={activeQuizTopic} 
            questions={quizQuestions} 
            onComplete={handleQuizComplete} 
        />
      ) : (
        <>
          <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold text-white">Your Learning Journey</h1>
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
                onClick={handleStartQuiz}
                className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
              >
                Start Quiz on "{currentTopic.name}"
              </button>
            ) : (
                <div className="text-xl font-semibold text-green-400">All Topics Mastered!</div>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default StudentDashboard;
