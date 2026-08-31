import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

/*
 * Attach JWT token to protected API requests.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("craftpass_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/*
 * Central response error handling.
 */
api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("craftpass_token");
        }

        return Promise.reject(error);
    }
);

export default api;