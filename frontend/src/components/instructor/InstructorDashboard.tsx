
import React, { useState } from 'react';
import SyllabusInput from './SyllabusInput';
import AnalyticsView from './AnalyticsView';
import StudyGuideGenerator from './StudyGuideGenerator';
import QuestionBankView from './QuestionBankView';

type Tab = 'syllabus' | 'analytics' | 'studyGuide' | 'qbank';

const InstructorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('syllabus');

  const renderContent = () => {
    switch (activeTab) {
      case 'syllabus':
        return <SyllabusInput />;
      case 'analytics':
        return <AnalyticsView />;
      case 'studyGuide':
        return <StudyGuideGenerator />;
      case 'qbank':
        return <QuestionBankView />;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{tabName: Tab; label: string}> = ({ tabName, label }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200 ${
            activeTab === tabName
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
  );

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Instructor Console</h1>
        <p className="mt-1 text-gray-400">Manage course content, generate questions, and analyze student performance.</p>
      </div>

      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-2" aria-label="Tabs">
            <TabButton tabName="syllabus" label="Syllabus & AI Generation" />
            <TabButton tabName="analytics" label="Analytics" />
            <TabButton tabName="studyGuide" label="Study Guide Generator" />
            <TabButton tabName="qbank" label="Question Bank" />
        </nav>
      </div>
      
      <div>{renderContent()}</div>
    </main>
  );
};

export default InstructorDashboard;
