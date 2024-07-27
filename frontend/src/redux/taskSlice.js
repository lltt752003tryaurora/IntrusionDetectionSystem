import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { manageTaskServ } from "../service/manageTask";

const initialState = {
    arrAllTaskTypes: [],
    arrPriorities: [],
    arrStatus: [],
    taskDetail: {
        "priorityTask": {
            "priorityId": 3,
            "priority": "Low"
        },
        "taskTypeDetail": {
            "id": 1,
            "taskType": "bug"
        },
        "assigness": [
            {
                "id": 6133,
                "avatar": "https://ui-avatars.com/api/?name=khimdang",
                "name": "khimdang",
                "alias": "khoi-dang"
            },
            {
                "id": 6186,
                "avatar": "https://ui-avatars.com/api/?name=minh",
                "name": "minh1",
                "alias": "minh"
            },
            {
                "id": 6126,
                "avatar": "https://ui-avatars.com/api/?name=minh",
                "name": "minh2",
                "alias": "minh"
            }
        ],
        "lstComment": [],
        "taskId": 11487,
        "taskName": "khang buom",
        "alias": "khang-buom",
        "description": "<h1>v<span style=\"color: rgb(224, 62, 45);\">axidsd</span></h1>",
        "statusId": "3",
        "originalEstimate": 10,
        "timeTrackingSpent": 20,
        "timeTrackingRemaining": 30,
        "typeId": 1,
        "priorityId": 3,
        "projectId": 14709
    },
    taskUpdate: {
        taskId: "",
        statusId: "",
    }
};

export const getAllTaskTypesAPI = createAsyncThunk(
    "task/getAllTaskTypesAPI",
    async () => {
        const res = await manageTaskServ.getAllTaskTypes();
        return res.data.content;
    }
);

export const getAllPrioritiesAPI = createAsyncThunk(
    "task/getAllPrioritiesAPI",
    async () => {
        const res = await manageTaskServ.getAllPriorities();
        return res.data.content;
    }
);

export const getAllStatusAPI = createAsyncThunk("project/getAllStatusAPI", async () => {
    const res = await manageTaskServ.getAllStatus();
    return res.data.content;
})

export const getTaskDetailAPI = createAsyncThunk("project/getTaskDetailAPI", async (taskId) => {
    const res = await manageTaskServ.getTaskDetail(taskId);
    return res.data.content;
})

export const updateStatusTaskAPI = createAsyncThunk("project/updateStatusTaskAPI", async (data) => {
    const res = await manageTaskServ.updateStatusTask(data).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
    return res.data.content;
})

export const updateAssignessTaskAPI = createAsyncThunk("project/updateAssignessTaskAPI", async (data) => {
    const res = await manageTaskServ.updateAssignTask(data).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
    return res.data.content;
})

export const updateTaskAPI = createAsyncThunk("project/updateTaskAPI", async (data) => {
    const res = await manageTaskServ.updateTask(data).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
    return res.data.content;
})

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        changeTaskModel: (state, action) => {
            // thay đôi trạng thái handlechange ở các thẻ input, select khi user nhập, chọn
            // Destructuring để lấy tên và giá trị từ action.payload
            const { name, value } = action.payload;

            // Cập nhật state bằng cách kiểm tra xem name có tồn tại trong taskDetail không, những giá trị còn lại sẽ được giữ nguyên
            if (name in state.taskDetail) {
                state.taskDetail[name] = value;
            }
        },
        changeTaskModelAssignMember: (state, action) => {
            if (action.payload.id) { // nếu có userSelected
                // copy bản sao
                let assigness = state.taskDetail.assigness;
                // thêm user vào assigness
                assigness.push(action.payload);
                // cập nhật
                state.taskDetail.assigness = assigness
            }
        },
        changeTaskModelDescription: (state, action) => {
            state.taskDetail["description"] = action.payload;
        },
        removeUserFromAssignessInTask: (state, action) => {
            // xóa user khỏi task
            // tạo 1 assigness mới sao cho không có thằng user muốn xóa
            let assigness = state.taskDetail.assigness.filter(user => user.id !== action.payload.id);
            // cập nhật
            state.taskDetail.assigness = assigness
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllTaskTypesAPI.fulfilled, (state, action) => {
            state.arrAllTaskTypes = action.payload;
        }).addCase(getAllPrioritiesAPI.fulfilled, (state, action) => {
            state.arrPriorities = action.payload;
        }).addCase(getAllStatusAPI.fulfilled, (state, action) => {
            state.arrStatus = action.payload;
        }).addCase(getTaskDetailAPI.fulfilled, (state, action) => {
            state.taskDetail = action.payload;
        }).addCase(updateStatusTaskAPI.fulfilled, (state, action) => {
            // state.taskUpdate.statusId = action.payload.statusId;
            // state.taskUpdate.taskId = action.payload.taskId;
        });
    },
});

// Action creators are generated for each case reducer function
export const { changeTaskModel, changeTaskModelAssignMember, removeUserFromAssignessInTask, changeTaskModelDescription } = taskSlice.actions;

export default taskSlice.reducer;
