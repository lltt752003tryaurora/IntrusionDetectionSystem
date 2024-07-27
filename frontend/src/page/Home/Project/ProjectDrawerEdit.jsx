import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Select,
  Space,
  Empty,
  message,
  Popconfirm,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, handleDrawerOpen } from "../../../redux/drawerSlice";
const { Option } = Select;

const ProjectDrawerEdit = () => {
  const { isDrawerOpen, DrawerContent } = useSelector(
    (state) => state.drawerSlice
  );
  const dispatch = useDispatch();
  const showDrawer = () => {
    dispatch(handleDrawerOpen());
  };
  const onClose = () => {
    dispatch(closeDrawer());
  };
  const confirm = (e) => {
    message.success("Success");
  };
  const cancel = (e) => {
    message.error("Click on No");
  };
  return (
    <>
      <Drawer
        className="rounded-3xl"
        width={720}
        onClose={onClose}
        open={isDrawerOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        {!DrawerContent ? (
          <Empty description="You do not have the permission to work on this" />
        ) : (
          DrawerContent
        )}
      </Drawer>
    </>
  );
};

export default ProjectDrawerEdit;
