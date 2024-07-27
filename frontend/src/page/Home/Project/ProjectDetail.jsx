import React, { useEffect } from "react";
import MainBoard from "../../../components/HomeComponents/MainBoard/MainBoard";
import InfoModal from "../../../components/HomeComponents/InfoModal/InfoModal";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import { getDetailProjectAPI } from "../../../redux/projectSlice";
import { USER_LOGIN } from "../../../util/constant/settingSystem";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const userData = JSON.parse(localStorage.getItem(USER_LOGIN));
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  if (!userData) {
    setTimeout(() => {
      messageApi.error("You must login to use this field 🤬.");
      navigate("/manage-project/project-manage");
    }, 3000);
  }
  const dispatch = useDispatch();
  const { projectDetail } = useSelector((state) => state.projectSlice);
  useEffect(() => {
    dispatch(getDetailProjectAPI(projectId));
  }, []);
  // console.log(projectDetail);
  return (
    <>
      {contextHolder}
      <div>
        <MainBoard projectDetail={projectDetail} />
        <InfoModal projectDetail={projectDetail} />
      </div>
    </>
  );
};

export default ProjectDetail;
