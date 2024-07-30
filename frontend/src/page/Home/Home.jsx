import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, Menu, message, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {
  DesktopOutlined,
  ProfileOutlined,
  PieChartOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  LineChartOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { saveLocalStore } from "../../util/localStore";
import { useDispatch, useSelector } from "react-redux";
import { getDetailProjectAPI } from "../../redux/projectSlice";
import { setDataUser } from "../../redux/userSlice";

const Home = () => {
  const dispatch = useDispatch();
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
  const { user } = useSelector((state) => state.userSlice);
  const { projectId } = useParams();
  const { projectDetail } = useSelector((state) => state.projectSlice);

  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = [
    getItem("Dashboard", "dashboard", <PieChartOutlined />),
    getItem("Monitor", "monitor", <ProfileOutlined />),
  ];

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  return (
    <>
      {contextHolder}
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            // navigate
            onSelect={({ item, key, keyPath, selectedKeys, domEvent }) => {
              console.log(key);
              navigate(`/manage-project/${key}`);
            }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          />
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
            </Breadcrumb>
            <Outlet />
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
