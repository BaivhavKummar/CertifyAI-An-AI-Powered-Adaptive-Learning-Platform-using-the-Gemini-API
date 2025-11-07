import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircleIcon, LightBulbIcon } from '../icons/Icons';

interface PerformanceViewProps {
    analyticsData: any;
}

const STRENGTH_THRESHOLD = 80;
const WEAKNESS_THRESHOLD = 60;

const PerformanceView: React.FC<PerformanceViewProps> = ({ analyticsData }) => {
    // For this demo, we'll find the data for "Alice" as the mock student user
    const studentData = useMemo(() => {
        return analyticsData?.masteryHeatmap?.find((d: any) => d.student === 'Alice');
    }, [analyticsData]);

    const chartData = useMemo(() => {
        if (!studentData) return [];
        return Object.keys(studentData)
            .filter(key => key !== 'student')
            .map(topic => ({
                name: topic,
                Mastery: studentData[topic]
            }));
    }, [studentData]);

    const { strengths, weaknesses, overallMastery } = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return { strengths: [], weaknesses: [], overallMastery: 0 };
        }
        const strengths = chartData.filter(d => d.Mastery >= STRENGTH_THRESHOLD);
        const weaknesses = chartData.filter(d => d.Mastery < WEAKNESS_THRESHOLD);
        const totalMastery = chartData.reduce((acc, curr) => acc + curr.Mastery, 0);
        const overallMastery = Math.round(totalMastery / chartData.length);
        return { strengths, weaknesses, overallMastery };
    }, [chartData]);

    if (!studentData) {
        return <div className="text-center text-gray-400 mt-10">Performance data is not yet available. Complete a quiz to get started!</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-gray-400">Overall Mastery</h3>
                    <p className="text-5xl font-bold text-purple-400 mt-2">{overallMastery}%</p>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                        <CheckCircleIcon className="w-6 h-6 mr-2 text-green-400" /> Strengths
                    </h3>
                    <ul className="space-y-2">
                        {strengths.map(s => <li key={s.name} className="text-sm text-gray-300">{s.name}</li>)}
                         {strengths.length === 0 && <p className="text-sm text-gray-400">Keep working to build up your strengths!</p>}
                    </ul>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                        <LightBulbIcon className="w-6 h-6 mr-2 text-amber-400" /> Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                        {weaknesses.map(w => <li key={w.name} className="text-sm text-gray-300">{w.name}</li>)}
                        {weaknesses.length === 0 && <p className="text-sm text-gray-400">No specific weak areas found. Great job!</p>}
                    </ul>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Mastery by Topic</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" unit="%" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1f2937', 
                                    border: '1px solid #4b5563',
                                    color: '#e5e7eb'
                                }}
                                cursor={{fill: 'rgba(147, 51, 234, 0.1)'}}
                            />
                            <Legend wrapperStyle={{color: '#e5e7eb'}}/>
                            <Bar dataKey="Mastery" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PerformanceView;
