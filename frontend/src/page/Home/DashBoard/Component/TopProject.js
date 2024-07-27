import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TopProjectsBarChart = () => {
    const { arrAllProjects } = useSelector((state) => state.projectSlice);
    const [topProjectsData, setTopProjectsData] = useState([]);

    useEffect(() => {
        // Sort projects by the number of members and get the top 5
        const sortedProjects = [...arrAllProjects].sort((a, b) => b.members.length - a.members.length).slice(0, 5);

        // Transform data for the chart
        const chartData = sortedProjects.map(project => ({
            name: project.projectName,
            'Number of members': project.members.length // Change the key name here
        }));

        setTopProjectsData(chartData);
    }, [arrAllProjects]);

    return (
        <BarChart
            width={600}
            height={300}
            data={topProjectsData}
            margin={{
                top: 20, right: 30, left: 20, bottom: 20,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend align="center" verticalAlign="top" height={36}/> {/* Adjust legend position */}
            <Bar dataKey="Number of members" fill="#82ca9d" />
        </BarChart>
    );
};

export default TopProjectsBarChart;
