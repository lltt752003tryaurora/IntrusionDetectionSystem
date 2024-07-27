import Header from "../../components/Header/Header";
import React from "react";
import { Outlet } from "react-router-dom";
import ProjectDrawerEdit from "../../page/Home/Project/ProjectDrawerEdit";

const UserTemplate = () => {
  return (
    <div>
      <Header />
      <div className="">
        <ProjectDrawerEdit />
        <Outlet />
      </div>
    </div>
  );
};

export default UserTemplate;
