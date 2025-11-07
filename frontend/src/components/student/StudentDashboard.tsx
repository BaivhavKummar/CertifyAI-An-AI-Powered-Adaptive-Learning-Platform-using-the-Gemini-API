import React, { useState, useMemo, useEffect } from 'react';
import { Topic, Question } from '../../types';
import QuizView from './QuizView';
import { fetchTopics, fetchQuizForTopic, fetchAnalytics } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { DashboardIcon, ChartBarIcon, SparklesIcon } from '../icons/Icons';
import DashboardView from './DashboardView';
import PerformanceView from './PerformanceView';
import AITutorView from './AITutorView';

type Tab = 'dashboard' | 'performance' | 'tutor';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeQuizTopic, setActiveQuizTopic] = useState<Topic | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedTopics, fetchedAnalytics] = await Promise.all([
          fetchTopics(),
          fetchAnalytics()
        ]);
        setTopics(fetchedTopics);
        setAnalyticsData(fetchedAnalytics);
      } catch (err: any) {
        setError('Failed to load student data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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

  const handleStartQuiz = async () => {
    if (currentTopic) {
      try {
        setIsQuizLoading(true);
        const questions = await fetchQuizForTopic(currentTopic.name);
        setQuizQuestions(questions);
        setActiveQuizTopic(currentTopic);
      } catch (err) {
        setError(`Failed to load quiz for ${currentTopic.name}.`);
      } finally {
        setIsQuizLoading(false);
      }
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
    setQuizQuestions([]);
  };

  const TabButton: React.FC<{tabName: Tab; label: string; icon: React.ReactNode}> = ({ tabName, label, icon }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200 ${
            activeTab === tabName
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {icon}
        {label}
    </button>
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading your dashboard..." /></div>;
    }
    if (error) {
      return <div className="text-center text-red-400 mt-10 p-4 bg-red-900/50 rounded-lg">{error}</div>;
    }
    switch(activeTab) {
      case 'dashboard':
        return <DashboardView 
                  topics={topics} 
                  currentTopic={currentTopic} 
                  onStartQuiz={handleStartQuiz}
                  isQuizLoading={isQuizLoading}
                />;
      case 'performance':
        return <PerformanceView analyticsData={analyticsData} />;
      case 'tutor':
        return <AITutorView topics={topics} />;
      default:
        return null;
    }
  };

  if (activeQuizTopic) {
    return (
       <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <QuizView 
            topic={activeQuizTopic} 
            questions={quizQuestions} 
            onComplete={handleQuizComplete} 
        />
       </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Student Console</h1>
        <p className="mt-1 text-gray-400">Your personal space for learning, tracking progress, and getting help.</p>
      </div>

       <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-2" aria-label="Tabs">
            <TabButton tabName="dashboard" label="Dashboard" icon={<DashboardIcon className="w-5 h-5 mr-2" />} />
            <TabButton tabName="performance" label="Performance" icon={<ChartBarIcon className="w-5 h-5 mr-2" />} />
            <TabButton tabName="tutor" label="AI Tutor" icon={<SparklesIcon className="w-5 h-5 mr-2" />} />
        </nav>
      </div>

      <div>{renderContent()}</div>
    </main>
  );
};

export default StudentDashboard;
