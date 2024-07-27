import { SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import {
  Button,
  Input,
  Space,
  Table,
  message,
  Tag,
  Avatar,
  Popover,
  AutoComplete,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProjectAPI,
  setNullArrAllProjects,
} from "../../../redux/projectSlice";
import { TOKEN, USER_LOGIN } from "../../../util/constant/settingSystem";
import ProjectActionButtons from "../Project/ProjectActionBtn";
import { Link, useNavigate } from "react-router-dom";
import { manageUserServ } from "../../../service/manageUser";
import { getUserSearchAPI } from "../../../redux/userSlice";
import TableAddProject from "./TableAddProject";

const ProjectManagement = () => {
  const { arrAllProjects } = useSelector((state) => state.projectSlice);
  const { userSearch } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const token_user = localStorage.getItem(TOKEN);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token_user) {
      messageApi.loading("Take your time... 🥹");
      dispatch(getAllProjectAPI());
    } else {
      dispatch(setNullArrAllProjects([]));
      messageApi.error("You must login to access to this function");
    }
  }, []);

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [statusSort, setStatusSort] = useState(true);
  const [valueAddMember, setValueAddMember] = useState("");

  const searchRef = useRef(null);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const setAgeSort = () => {
    setStatusSort(!statusSort);
    setSortedInfo({
      order: statusSort ? "ascend" : "descend",
      columnKey: "id",
    });
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              color: "black",
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (dataIndex === "creator") {
        return record[dataIndex].name
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "10%",
      ...getColumnSearchProps("id"),
      filteredValue: filteredInfo.id || null,
      sorter: (a, b) => a.id.length - b.id.length,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      width: "18%",
      ...getColumnSearchProps("projectName"),
      filteredValue: filteredInfo.projectName || null,
      sorter: (a, b) => a.projectName.length - b.projectName.length,
      sortOrder:
        sortedInfo.columnKey === "projectName" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text, record, index) => {
        return (
          <div
            onClick={() => {
              const yourProject = JSON.parse(localStorage.getItem(USER_LOGIN));
              // if project was your project or you was added in project
              const checkAuthorizationAccessProject =
                record.members?.find((mem) => mem.userId == yourProject.id) !==
                undefined;
              if (
                yourProject.id === record.creator.id ||
                checkAuthorizationAccessProject
              ) {
                messageApi.success("Success to get project detail");
                setTimeout(() => {
                  navigate(`/manage-project/project-detail/${record.id}`);
                }, 2000);
              } else {
                messageApi.error(
                  "It is not your project, please choose your project"
                );
              }
            }}
          >
            <Tag
              className="hover:text-green-400 duration-300 hover:cursor-pointer hover:border-green-400"
              color="geekblue"
            >
              {text}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      width: "13%",
      ...getColumnSearchProps("creator"),
      filteredValue: filteredInfo.creator || null,
      sorter: (a, b) => a.creator.name.length - b.creator.name.length,
      sortOrder: sortedInfo.columnKey === "creator" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text, record, index) => {
        return <Tag color="green">{text.name}</Tag>;
      },
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      width: "15%",
      render: (members, record) => (
        <div className="flex space-x-0.5">
          <Popover
            placement="top"
            title="Member"
            content={() => {
              return <TableAddProject members={members} record={record} />;
            }}
          >
            {record.members?.slice(0, 2).map((member, index) => {
              return (
                <Avatar
                  alt={member.name}
                  src={<img src={member.avatar} title={member.name} alt="" />}
                />
              );
            })}
          </Popover>

          {members?.length > 2 ? (
            <Avatar style={{ backgroundColor: "#dddddd", color: "black" }}>
              ...
            </Avatar>
          ) : (
            ""
          )}
          <Popover
            placement="bottom"
            title={
              <Tag bordered={false} color="success">
                Add Members
              </Tag>
            }
            content={
              <div className="flex justify-between">
                <AutoComplete
                  // Must to change value of data into another array
                  options={userSearch?.map((user, index) => {
                    return {
                      label: user.name,
                      value: user.userId.toString(),
                    };
                  })}
                  value={valueAddMember}
                  style={{ width: "100%" }}
                  onChange={(text) => {
                    // user enter data => set data again
                    setValueAddMember(text);
                  }}
                  onSearch={(value) => {
                    // kĩ thuật Debounce Search => hạn chế số lần gọi API
                    // useRef => giới hạn số lần render
                    if (searchRef.currentValue) {
                      // lần đầu giá trị null nên xóa timeout, ngăn chặn thực thi tìm kiếm khi user đang nhập
                      clearTimeout(searchRef.currentValue);
                    }
                    searchRef.current = setTimeout(() => {
                      dispatch(getUserSearchAPI(value));
                    }, 300);
                  }}
                  onSelect={(valueSelect, option) => {
                    setValueAddMember(option.label);
                    manageUserServ
                      .addMemberInProject({
                        projectId: record.id,
                        userId: valueSelect,
                      })
                      .then((res) => {
                        dispatch(getAllProjectAPI());
                        console.log(res);
                        messageApi.success("Add member success.");
                      })
                      .catch((err) => {
                        console.log(err);
                        if (err.response.data.statusCode === 403) {
                          messageApi.error(
                            "This is not your project. Please do not touch it."
                          );
                        } else if (err.response.data.statusCode === 500) {
                          messageApi.error(err.response.data.content);
                        }
                      });
                  }}
                />
              </div>
            }
          >
            <Button size="middle" shape="circle" icon={<PlusOutlined />} />
          </Popover>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "13%",
      ...getColumnSearchProps("categoryName"),
      sorter: (a, b) => a.categoryName - b.categoryName,
      sortOrder:
        sortedInfo.columnKey === "categoryName" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text, record, index) => {
        return <Tag color="magenta">{text}</Tag>;
      },
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      sorter: (a, b) => a.description.length - b.description.length,
      sortOrder:
        sortedInfo.columnKey === "description" ? sortedInfo.order : "null",
      ellipsis: true,
      render: (text, record, index) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, "text/html");
        let plainText = htmlDoc.body.textContent || "";

        // limit the number of characters
        const maxLength = 20;

        // Check the script too long to cut "..."
        if (plainText.length > maxLength) {
          plainText = plainText.substring(0, maxLength) + "...";
        }

        return (
          <div key={index} title={plainText}>
            {plainText}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => {
        return (
          <Space size="middle">
            <ProjectActionButtons project={record} />
          </Space>
        );
      },
    },
  ];
  return (
    <>
      {contextHolder}
      <div className="container mx-auto rounded-3xl p-5 bg-slate-400">
        <h1 className="font-bold text-2xl text-blue-900 mb-5">
          Project Management
        </h1>
        <Space
          style={{
            marginBottom: 16,
          }}
        >
          <Button onClick={setAgeSort} className="text-black font-mono">
            Sort Id Project
          </Button>
          <Button onClick={clearFilters} className="text-black font-mono">
            Clear search
          </Button>
          <Button onClick={clearAll} className="text-black font-mono">
            Clear search and sorters
          </Button>
          <Button
            onClick={() => {
              navigate("/manage-project/create-project");
            }}
            className="text-black font-mono"
          >
            Create your project
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={arrAllProjects}
          onChange={handleChange}
        />
        ;
      </div>
    </>
  );
};

export default ProjectManagement;
