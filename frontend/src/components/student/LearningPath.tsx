
import React from 'react';
import { Topic } from '../../types';
import { CheckCircleIcon } from '../icons/Icons';

interface LearningPathProps {
  topics: Topic[];
  currentTopicId?: string;
}

const LearningPath: React.FC<LearningPathProps> = ({ topics, currentTopicId }) => {

  const getTopicStatus = (topic: Topic) => {
    if (topic.mastery === 100) return 'completed';
    if (topic.id === currentTopicId) return 'current';
    
    const prereqsMet = topic.prerequisites.every(prereqId => {
        const prereqTopic = topics.find(pt => pt.id === prereqId);
        return prereqTopic && prereqTopic.mastery === 100;
      });

    return prereqsMet ? 'unlocked' : 'locked';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white">Course Topics</h2>
        <div className="relative">
            {/* Dashed line connector */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-600/50 border-l-2 border-dashed border-gray-600"></div>

            <div className="space-y-8">
                {topics.map(topic => {
                    const status = getTopicStatus(topic);
                    const statusClasses = {
                        completed: 'border-green-500 bg-green-500/10 text-green-300',
                        current: 'border-purple-500 bg-purple-500/20 text-purple-300 ring-2 ring-purple-500',
                        unlocked: 'border-gray-600 bg-gray-700/50 text-gray-300',
                        locked: 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed',
                    };

                    return (
                    <div key={topic.id} className="relative flex items-center">
                        <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${statusClasses[status].split(' ').slice(1).join(' ')} border-2 ${statusClasses[status].split(' ')[0]}`}>
                            {status === 'completed' ? <CheckCircleIcon className="w-6 h-6"/> : <span className="font-bold">{topics.indexOf(topic) + 1}</span>}
                        </div>
                        <div className={`ml-6 p-4 rounded-lg flex-1 ${statusClasses[status]}`}>
                            <h3 className="font-semibold text-lg">{topic.name}</h3>
                            <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${topic.mastery}%` }}></div>
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default LearningPath;
