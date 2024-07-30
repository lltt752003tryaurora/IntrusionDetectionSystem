// fetchFromAPI.js (sử dụng Axios)

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/v1";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function login(username, password) {
    try {
        const response = await apiClient.post("/auth/login", { username, password });
        const data = response.data;

        console.log("Login successful:", data);
        return data;
    } catch (error) {
        console.error("Login failed:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function signup(username, password) {
    try {
        const response = await apiClient.post("/auth/register", { username, password });
        const data = response.data;

        console.log("Signup successful:", data);
        return data;
    } catch (error) {
        console.error("Signup failed:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function uploadCSV(csvFile) {
    const formData = new FormData();
    formData.append("csvFile", csvFile);

    try {
        const detectApiClient = axios.create({
            baseURL: "http://localhost:5000",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const response = await detectApiClient.post("/detect/LGBM", formData); // Endpoint mới
        const data = response.data;

        console.log("Upload successful:", data);
        return data;
    } catch (error) {
        console.error("Upload failed:", error.response ? error.response.data : error.message);
        throw error;
    }
}