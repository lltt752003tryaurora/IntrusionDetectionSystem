// react-router-dom
import { Routes, Route, Navigate } from "react-router-dom";
import UserTemplate from "./template/HomeTemplate/UserTemplate";
import Home from "./page/Home/Home";
import Login from "./page/User/Login/Login";
import SignUp from "./page/User/SignUp/SignUp";
import Error from "./page/Error/Error";
import LandingPage from "./page/Home/LandingPage/LandingPage";
import DashBoard from "./page/Home/DashBoard/DashBoard";
import CreateProject from "./page/Home/Project/CreateProject";
import ProjectManagement from "./page/Home/Management/ProjectManagement";
import ProjectDetail from "./page/Home/Project/ProjectDetail";
import UserDetails from "./page/Home/Profile/profile";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/" element={<UserTemplate />}>
          <Route path="manage-project" element={<Home />}>
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="project-manage" element={<ProjectManagement />} />
            <Route path="project-detail/:projectId" element={<ProjectDetail />} />
            <Route path="project-detail" element={<ProjectDetail />} />
            <Route path="profile" element={<UserDetails />} />
            <Route path="create-project" element={<CreateProject />} />
          </Route>
        </Route>

        <Route path="sign-in" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="error" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
