import React, { useState, useEffect } from 'react';
import MasteryHeatmap from './MasteryHeatmap';
import MasteryTrajectoryChart from './MasteryTrajectoryChart';
import { fetchAnalytics } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const AnalyticsView: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalyticsData(data);
      } catch (err: any) {
        setError('Failed to load analytics data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading analytics..." /></div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-10">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Cohort Progress Heatmap</h2>
        <p className="text-gray-400 mb-6">Visualize student mastery across all topics. Darker shades indicate higher mastery.</p>
        <MasteryHeatmap data={analyticsData?.masteryHeatmap || []} />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Mastery Trajectory</h2>
        <p className="text-gray-400 mb-6">Track the growth of mastery over time for different students.</p>
        <MasteryTrajectoryChart data={analyticsData?.masteryTrajectory || []} />
      </div>
    </div>
  );
};

export default AnalyticsView;
