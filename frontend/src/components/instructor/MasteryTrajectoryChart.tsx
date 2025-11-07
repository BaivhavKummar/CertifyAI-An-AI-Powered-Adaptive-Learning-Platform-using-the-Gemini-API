
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrajectoryChartProps {
    data: any[];
}

const MasteryTrajectoryChart: React.FC<TrajectoryChartProps> = ({ data }) => {
    if (data.length === 0) {
        return <p className="text-gray-400">No trajectory data available.</p>;
    }

    const studentKeys = Object.keys(data[0]).filter(key => key !== 'week');
    const colors = ['#9333ea', '#84cc16', '#f97316', '#ec4899'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" unit="%" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #4b5563',
                            color: '#e5e7eb'
                        }}
                    />
                    <Legend wrapperStyle={{color: '#e5e7eb'}}/>
                    {studentKeys.map((key, index) => (
                        <Line 
                            key={key} 
                            type="monotone" 
                            dataKey={key} 
                            stroke={colors[index % colors.length]} 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MasteryTrajectoryChart;
