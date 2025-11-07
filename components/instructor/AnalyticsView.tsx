
import React from 'react';
import MasteryHeatmap from './MasteryHeatmap';
import MasteryTrajectoryChart from './MasteryTrajectoryChart';

const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Cohort Progress Heatmap</h2>
        <p className="text-gray-400 mb-6">Visualize student mastery across all topics. Darker shades indicate higher mastery.</p>
        <MasteryHeatmap />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Mastery Trajectory</h2>
        <p className="text-gray-400 mb-6">Track the growth of mastery over time for different students.</p>
        <MasteryTrajectoryChart />
      </div>
    </div>
  );
};

export default AnalyticsView;
