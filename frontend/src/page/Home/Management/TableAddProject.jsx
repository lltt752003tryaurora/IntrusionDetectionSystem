import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Table, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { manageUserServ } from "../../../service/manageUser";
import { useDispatch } from "react-redux";
import { getAllProjectAPI } from "../../../redux/projectSlice";
import { useRef } from "react";

const TableAddProject = ({ members, record }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      key: "action",
      sorter: true,
      render: (user) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Delete the member"
              description="Are you sure to delete this member?"
              onConfirm={() => {
                manageUserServ
                  .deleteMemberInProject({
                    userId: user.id,
                    projectId: record.id,
                  })
                  .then((res) => {
                    console.log(res);
                    messageApi.success("Remove member success.");
                    dispatch(getAllProjectAPI());
                  })
                  .catch((err) => {
                    console.log(err);
                    if (err.response.data.statusCode === 403) {
                      messageApi.error(
                        "This is not your project. You can not remove this user."
                      );
                    } else if (err.response.data.statusCode === 500) {
                      messageApi.error(err.response.data.content);
                    }
                  });
              }}
              //   onCancel={cancel}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <DeleteOutlined
                className="hover:text-slate-500 duration"
                style={{ color: "red" }}
                title="Delete"
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    const newData =
      members?.map((item, index) => ({
        key: index,
        id: item.userId,
        name: item.name,
        avatar: (
          <img
            src={item.avatar}
            title={item.name}
            className="w-10 h-10 rounded-full"
            alt=""
          />
        ),
      })) || [];
    setData(newData);
  }, [members]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const deleteAllSelectedMembers = () => {
    if (selectedRowKeys.length === 0) {
      messageApi.warning("No members selected.");
      return;
    }

    setLoading(true);

    const deletePromises = selectedRowKeys.map((key) => {
      const member = data.find((item) => item.key === key);
      return manageUserServ.deleteMemberInProject({
        userId: member.id,
        projectId: record.id,
      });
    });

    Promise.all(deletePromises)
      .then(() => {
        messageApi.success("All selected members have been removed.");
        setSelectedRowKeys([]);
        dispatch(getAllProjectAPI());
      })
      .catch((err) => {
        messageApi.error("You do not have permission to delete these members.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const hasSelected = selectedRowKeys.length > 0;
  const paginationConfig = data.length > 3 ? { pageSize: 3 } : false;
  return (
    <>
      {contextHolder}
      <div>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className="flex space-x-2">
            <Button
              type="default"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
            >
              Reload
            </Button>
            <Popconfirm
              title="Delete All Members"
              description="Are you sure to delete all?"
              okText="Yes"
              cancelText="No"
              onConfirm={deleteAllSelectedMembers}
              okButtonProps={{
                style: { backgroundColor: "red", color: "white" },
              }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete All Members
              </Button>
            </Popconfirm>
          </div>

          <span
            style={{
              margin: "8px",
            }}
          >
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={paginationConfig}
        />
      </div>
    </>
  );
};

export default TableAddProject;
