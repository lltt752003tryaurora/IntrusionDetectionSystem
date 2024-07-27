import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const PieChartDB = () => {
    const { arrAllProjects } = useSelector((state) => state.projectSlice);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        const categoryCount = {};
        arrAllProjects.forEach((project) => {
            categoryCount[project.categoryName] = (categoryCount[project.categoryName] || 0) + 1;
        });
        setCategoryData(Object.keys(categoryCount).map(key => ({ name: key, value: categoryCount[key] })));
    }, [arrAllProjects]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={categoryData}
                    cx={200}
                    cy={200}
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" />
            </PieChart>
        </div>
    );
};

export default PieChartDB;
