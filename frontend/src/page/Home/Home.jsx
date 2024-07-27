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

const Home = () => {
  const { user } = useSelector((state) => state.userSlice);
  const { projectId } = useParams();
  const { projectDetail } = useSelector((state) => state.projectSlice);
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();
  const [pageNavi, setPageNavi] = useState(
    localStorage.getItem("pageNavi")
      ? JSON.parse(localStorage.getItem("pageNavi"))
      : "Dashboard"
  );
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = [
    getItem("Dashboard", "dashboard", <PieChartOutlined />),
    getItem("Management", "sub1", <LineChartOutlined />, [
      // getItem(
      //   "User Management",
      //   "user-manage",
      //   <UsergroupAddOutlined />,
      //   null,
      //   {
      //     disabled: user !== null,
      //   }
      // ),
      getItem("Project Management", "project-manage", <DesktopOutlined />),
      getItem(
        "Project Details",
        projectId ? `project-detail/${projectId}` : "project-detail",
        <ProjectOutlined />,
        null,
        { disabled: !projectId } // Vô hiệu hóa nếu không có projectId
      ),
    ]),
    getItem("Project", "sub2", <UnorderedListOutlined />, [
      getItem("Create Project", "create-project", <PlusCircleOutlined />),
    ]),
    getItem("My Profile", "profile", <ProfileOutlined />, null, {
      disabled: user == null,
    }),
  ];

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  /// all key
  const breadcrumbMap = {
    // "dashboard": ["Dashboard"],
    "create-project": ["Project", "Create Project"],
    "user-manage": ["Management", "User Management"],
    "project-manage": ["Management", "Project Management"],
    "project-detail": ["Management", "Project Management", "Haha"],
  };

  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);

  // navigate to Project Details when projectId change
  useEffect(() => {
    const paths = location.pathname.split("/");
    const activeKey =
      paths[2] === "project-detail" ? `project-detail/${projectId}` : paths[2];
    setSelectedKeys([activeKey]);
    const updatedBreadcrumb = updateBreadcrumb(activeKey);
    setPageNavi(updatedBreadcrumb);
    saveLocalStore("pageNavi", updatedBreadcrumb);
  }, [location, projectId]);

  // when path change
  useEffect(() => {
    const key = getKeyFromPath();
    const updatedBreadcrumb = updateBreadcrumb(key);
    setPageNavi(updatedBreadcrumb);
    saveLocalStore("pageNavi", updatedBreadcrumb);
  }, [location, projectId]);

  useEffect(() => {
    if (projectDetail && projectId) {
      const updatedBreadcrumb = [
        "Management",
        "Project Management",
        projectDetail.projectName,
      ];
      setPageNavi(updatedBreadcrumb);
      saveLocalStore("pageNavi", updatedBreadcrumb);
    }
  }, [projectDetail, projectId]);

  // update when click button
  const updateBreadcrumb = (key) => {
    return breadcrumbMap[key] || [];
  };

  // reload page
  const savedPageNavi = localStorage.getItem("pageNavi")
    ? JSON.parse(localStorage.getItem("pageNavi"))
    : ["Dashboard"];

  // determine key pageNavi
  const getKeyFromPath = () => {
    if (location.pathname.includes("project-detail") && projectId) {
      return `project-detail/${projectId}`;
    }
    // Thêm logic cho các đường dẫn khác nếu cần
    return location.pathname.split("/")[2] || "dashboard";
  };
  const defaultSelectedKey = Array.isArray(pageNavi)
    ? pageNavi[pageNavi.length - 1]
    : pageNavi;

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
            selectedKeys={selectedKeys}
            defaultSelectedKeys={[defaultSelectedKey]}
            mode="inline"
            items={items}
            // navigate
            onSelect={({ item, key, keyPath, selectedKeys, domEvent }) => {
              if (key === "project-detail" && !projectId) {
                messageApi.warning(
                  "You must enter Project Manager and choose your project to see this field."
                );
                return;
              }
              if (key === "profile" && !user) {
                messageApi.warning("You must login to use this field.");
                return;
              }
              if (key === "user-manage" && user) {
                messageApi.warning(
                  "You must be an ADMIN to use this function."
                );
                return;
              }
              const updatedBreadcrumb = updateBreadcrumb(key);
              setPageNavi(updatedBreadcrumb);
              saveLocalStore("pageNavi", updatedBreadcrumb);

              if (key.startsWith("project-detail")) {
                navigate(`/manage-project/project-detail/${projectId}`);
              } else {
                navigate(`/manage-project/${key}`);
              }
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
            <Breadcrumb style={{ margin: "16px 0" }}>
              {Array.isArray(pageNavi) ? (
                pageNavi.map((navItem, index) => (
                  <Breadcrumb.Item key={index}>{navItem}</Breadcrumb.Item>
                ))
              ) : (
                <Breadcrumb.Item>{pageNavi}</Breadcrumb.Item>
              )}
            </Breadcrumb>
            {/* This is place which help navigation */}
            <Outlet />
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©2023 Created by Wris TrieAurora
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
