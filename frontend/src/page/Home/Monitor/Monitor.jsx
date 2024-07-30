import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { message, Space, Table, Tag, FloatButton } from "antd";

const socket = io("http://127.0.0.1:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3001",
  },
});

const Monitor = () => {
  const [monitorData, setMonitorData] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    socket.on("monitor_result", (data) => {
      // console.log("Received monitor_result data:", data); // Debugging line
      try {
        const parsedData = JSON.parse(data);
        console.log("Parsed data:", parsedData); // Debugging line
        setMonitorData((prevData) => [...prevData, ...parsedData]);
      } catch (error) {
        messageApi.error("Error parsing data:", error);
      }
    });

    return () => {
      socket.off("monitor_result");
    };
  }, []);

  const startMonitoring = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/data/start_monitor",
        { duration: 0.1 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setIsMonitoring(true);
        messageApi.info("Monitoring started.");
      }
    } catch (error) {
      messageApi.error("Error starting monitoring:", error);
    }
  };

  const stopMonitoring = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/data/stop_monitor",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setIsMonitoring(false);
        messageApi.info("Monitoring stopped.");
      }
    } catch (error) {
      messageApi.error("Error stopping monitoring:", error);
    }
  };

  const columns = [
    {
      title: "Order",
      key: "order",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Protocol",
      dataIndex: "proto",
      key: "proto",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Duration",
      dataIndex: "dur",
      key: "dur",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Service",
      key: "service",
      dataIndex: "service",
    },
    {
      title: "Intrusion",
      key: "is_intrusion",
      dataIndex: "is_intrusion",
    },
    {
      title: "Intrusion",
      key: "is_intrusion",
      dataIndex: "is_intrusion",
      render: (text) =>
        text === 1 ? (
          <Tag color="green">True</Tag>
        ) : (
          <Tag color="red">False</Tag>
        ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div>
        <button
          className="bg-blue-500 rounded-lg p-4 font-bold text-white hover:duration-300 mr-4 hover:bg-slate-500"
          onClick={startMonitoring}
          disabled={isMonitoring}
        >
          Start Monitoring
        </button>
        <button
          className="bg-red-500 rounded-lg p-4 font-bold text-white hover:duration-300 mr-4 hover:bg-slate-500"
          onClick={stopMonitoring}
          disabled={!isMonitoring}
        >
          Stop Monitoring
        </button>
        <h1 className="font-bold text-5xl bg-green-400 text-center rounded-lg p-3 mt-3">
          Monitor Data
        </h1>
        {/* <ul>
          {monitorData?.map((entry, index) => (
            <li key={index}>
              Protocol: {entry.proto}, Duration: {entry.dur}, Data: {entry.data}
              , Intrusion: {entry.is_intrusion ? "Yes" : "No"}
            </li>
          ))}
        </ul> */}
        <Table
          columns={columns}
          dataSource={monitorData}
          pagination={{ pageSize: 20 }}
        />
        <FloatButton.BackTop />
      </div>
    </>
  );
};

export default Monitor;
