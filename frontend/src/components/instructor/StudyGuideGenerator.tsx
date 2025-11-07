
import React, { useState, useEffect } from 'react';
import { fetchAnalytics, generateStudyGuideAPI } from '../../services/api';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import { ClipboardIcon, LightBulbIcon } from '../icons/Icons';

interface StudentMastery {
  student: string;
  [topic: string]: string | number;
}

interface WeakTopic {
  topic: string;
  mastery: number;
}

const WEAKNESS_THRESHOLD = 60;

const StudyGuideGenerator: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<StudentMastery[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [studyGuide, setStudyGuide] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalytics();
        const heatmapData = data.masteryHeatmap || [];
        setAnalyticsData(heatmapData);
        setStudents(heatmapData.map((s: StudentMastery) => s.student));
        if (heatmapData.length > 0) {
            setSelectedStudent(heatmapData[0].student);
        }
      } catch (err) {
        setError('Failed to load student data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedStudent || analyticsData.length === 0) {
        setWeakTopics([]);
        return;
    }
    const studentData = analyticsData.find(s => s.student === selectedStudent);
    if (studentData) {
      const topics = Object.keys(studentData).filter(key => key !== 'student');
      const weak = topics
        .map(topic => ({ topic, mastery: studentData[topic] as number }))
        .filter(item => item.mastery < WEAKNESS_THRESHOLD)
        .sort((a,b) => a.mastery - b.mastery);
      setWeakTopics(weak);
    }
  }, [selectedStudent, analyticsData]);

  const handleGenerateGuide = async () => {
    if (!selectedStudent || weakTopics.length === 0) return;
    setIsGenerating(true);
    setError(null);
    setStudyGuide('');
    try {
      const response = await generateStudyGuideAPI(selectedStudent, weakTopics);
      setStudyGuide(response.study_guide);
    } catch (err: any) {
      setError(err.message || 'Failed to generate study guide.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(studyGuide).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading student data..." /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
            <h2 className="text-2xl font-bold">Personalized Study Guide Generator</h2>
            
            <div>
                <label htmlFor="student-select" className="block text-sm font-medium text-gray-300 mb-2">1. Select a Student</label>
                <select
                    id="student-select"
                    className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    {students.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>

            {selectedStudent && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">2. Identified Weak Areas for {selectedStudent}</h3>
                    {weakTopics.length > 0 ? (
                        <ul className="space-y-2">
                            {weakTopics.map(({topic, mastery}) => (
                                <li key={topic} className="p-3 bg-gray-700/50 rounded-md text-sm">
                                    <span className="font-semibold">{topic}</span>
                                    <span className="text-red-400 float-right">{mastery}% Mastery</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-3 bg-green-900/50 rounded-md text-green-300 text-sm">
                            Great news! {selectedStudent} has no topics below the {WEAKNESS_THRESHOLD}% mastery threshold.
                        </p>
                    )}
                </div>
            )}
            
            <Button onClick={handleGenerateGuide} disabled={isGenerating || weakTopics.length === 0} className="w-full">
                {isGenerating ? 'Generating...' : '3. Generate AI Study Guide'}
            </Button>
            {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Generated Study Guide</h2>
            {isGenerating && <LoadingSpinner text="Crafting personalized guide..."/>}
            {!isGenerating && studyGuide && (
                <div className="relative">
                    <Button size="sm" variant="secondary" onClick={handleCopyToClipboard} className="absolute top-0 right-0">
                        <ClipboardIcon className="w-4 h-4 mr-2" />
                        {copySuccess || 'Copy'}
                    </Button>
                    <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-md text-gray-300 font-sans text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                        {studyGuide}
                    </pre>
                </div>
            )}
            {!isGenerating && !studyGuide && (
                <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
                    <LightBulbIcon className="w-12 h-12 text-amber-400 mb-4" />
                    <p>The personalized study guide for the selected student will appear here.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default StudyGuideGenerator;
