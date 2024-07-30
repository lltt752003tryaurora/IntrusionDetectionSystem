import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Divider, List, Typography } from "antd";
import { uploadCSV } from "../../../util/fetchFromAPI";
import PieChartDB from "../DashBoard/Component/PieChart";
import moment from "moment";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [intrusion, setIntrusion] = useState([]);
  const [checkHistogarm, setCheckHistogram] = useState(false);
  const [timestamps, setTimestamps] = useState([]);
  const data = file
    ? [`Name: ${file.name}`, `Type: ${file.type}`, `Size: ${file.size} bytes`]
    : [];
  const [messageApi, contextHolder] = message.useMessage();
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      messageApi.loading("Uploading file...");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await fetch("http://localhost:5000/detect/LGBM", {
          method: "POST",
          body: formData,
        });
        messageApi.success("Upload successful");
        const data = await result.json();
        console.log(data.intrusion);

        if (JSON.stringify(data.intrusion) !== JSON.stringify(intrusion)) {
          // Check for changes
          setIntrusion(data.intrusion);
          const newTimestamps = Array.from(
            { length: data.intrusion.length },
            () => Date.now()
          );
          setTimestamps(newTimestamps);
        }

        setCheckHistogram(true);
      } catch (error) {
        messageApi.error("Upload fail");
        console.error(error);
      }
    }
  };

  // Count normal and attacked states
  const normalCount = intrusion.filter((value) => value === 0).length;
  const attackedCount = intrusion.filter((value) => value === 1).length;

  // Data for Pie Chart
  const chartData = [
    { name: "Normal", value: normalCount },
    { name: "Attacked", value: attackedCount },
  ];
  const lineChartData = intrusion.map((value, index) => ({
    time: timestamps[index],
    status: value ? "Attacked" : "Normal",
  }));
  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#FF0000"];

  return (
    <>
      {contextHolder}
      <div>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="sr-only bg-blue-500 text-white rounded-lg"
          >
            Choose a file
          </label>
          <input id="file" type="file" onChange={handleFileChange} />
        </div>
        {file && (
          <List
            size="small"
            header={<div>Start</div>}
            footer={<div>End</div>}
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        )}

        {file && (
          <button
            className="mt-4 bg-green-500 hover:bg-slate-600 hover:duration-300 py-2 px-2 rounded-md font-bold hover:text-white"
            onClick={handleUpload}
          >
            Upload a file
          </button>
        )}
        {checkHistogarm && (
          <>
            <hr className="m-4" />
            <div className="font-bold bg-blue-500 text-center text-white py-3 rounded-lg">
              Intrusion Chart Dectection
            </div>
            <div className="flex mt-4 text-center justify-center">
              <div className="mr-4">
                <PieChart width={400} height={400}>
                  <Pie
                    data={chartData}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div className="">
                <LineChart width={500} height={300} data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(unixTime) =>
                      moment(unixTime).format("HH:mm:ss")
                    }
                    label={{
                      value: "Time",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Status",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="step"
                    dataKey="status"
                    stroke="#FF0000"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UploadCSV;
