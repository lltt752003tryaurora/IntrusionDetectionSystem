import React, { useEffect, useState } from "react";
import PieChartDB from "./Component/PieChart";
import TopCreatorsBarChart from "./Component/Top10Creator";
import TopProjectsBarChart from "./Component/TopProject";

import "./DashBoard.scss";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjectAPI } from "../../../redux/projectSlice";
import { useNavigate } from "react-router-dom";
import { setDataUser } from "../../../redux/userSlice";

const DashBoard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("USER_LOGIN"));
    if (userLocal) {
      navigate("/manage-project/dashboard");
      // window.location.reload(true);
      dispatch(setDataUser(userLocal));
    } else {
      navigate("/");
    }
  }, []);
  const { arrAllProjects } = useSelector((state) => state.projectSlice);
  const [categoryData, setCategoryData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const categoryCount = {};
    arrAllProjects.forEach((project) => {
      categoryCount[project.categoryName] =
        (categoryCount[project.categoryName] || 0) + 1;
    });
    setCategoryData(
      Object.keys(categoryCount).map((key) => ({
        name: key,
        value: categoryCount[key],
      }))
    );
  }, [arrAllProjects]);

  useEffect(() => {
    dispatch(getAllProjectAPI());
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard">
      <div className="box">
        <h1>
          <strong>Project Categories</strong>
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PieChartDB />
        </div>
      </div>
      <div className="box">
        <h1>
          <strong>Top projects</strong>
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TopProjectsBarChart />
        </div>
      </div>
      <div className="box box-wide">
        <h1>
          <strong>Top creators</strong>
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TopCreatorsBarChart />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
