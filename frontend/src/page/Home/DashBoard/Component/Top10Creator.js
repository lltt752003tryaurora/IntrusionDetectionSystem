import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TopCreatorsBarChart = () => {
    const { arrAllProjects } = useSelector((state) => state.projectSlice);
    const [creatorData, setCreatorData] = useState([]);

    useEffect(() => {
        const creatorCount = {};
        arrAllProjects.forEach(project => {
            const creatorName = project.creator.name;
            creatorCount[creatorName] = (creatorCount[creatorName] || 0) + 1;
        });

        const sortedCreators = Object.entries(creatorCount)
            .map(([name, count]) => ({ name, 'Number of projects': count })) // Rename 'count' to 'Number of projects'
            .sort((a, b) => b['Number of projects'] - a['Number of projects'])
            .slice(0, 15); // Get top 15 creators

        setCreatorData(sortedCreators);
    }, [arrAllProjects]);

    return (
        <BarChart
            width={1200}
            height={400}
            data={creatorData}
            margin={{
                top: 20, right: 30, left: 20, bottom: 50,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend align="center" verticalAlign="top" height={36}/> {/* Move legend to top */}
            <Bar dataKey="Number of projects" fill="#8884d8" />
        </BarChart>
    );
};

export default TopCreatorsBarChart;
