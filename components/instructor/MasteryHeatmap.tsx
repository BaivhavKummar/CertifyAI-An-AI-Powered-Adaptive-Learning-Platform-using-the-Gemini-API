
import React from 'react';
import { MOCK_ANALYTICS_DATA } from '../../constants';

const MasteryHeatmap: React.FC = () => {
    const data = MOCK_ANALYTICS_DATA.masteryHeatmap;
    const topics = Object.keys(data[0]).filter(key => key !== 'student');

    const getColor = (value: number) => {
        if (value > 90) return 'bg-blue-600';
        if (value > 75) return 'bg-blue-500';
        if (value > 50) return 'bg-blue-400';
        if (value > 25) return 'bg-blue-300/80';
        return 'bg-gray-600';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                    <tr>
                        <th scope="col" className="py-3 px-6 rounded-l-lg">
                            Student
                        </th>
                        {topics.map(topic => (
                            <th key={topic} scope="col" className="py-3 px-6">
                                {topic}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-gray-800 border-b border-gray-700">
                            <td className="py-4 px-6 font-medium text-white whitespace-nowrap">
                                {row.student}
                            </td>
                            {topics.map(topic => (
                                <td key={topic} className="py-4 px-6">
                                    <div className={`w-full h-8 flex items-center justify-center rounded ${getColor(row[topic as keyof typeof row] as number)}`}>
                                        <span className="font-bold text-white text-shadow-sm">{row[topic as keyof typeof row]}%</span>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MasteryHeatmap;
