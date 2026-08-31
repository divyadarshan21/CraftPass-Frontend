import api from "./api";

/**
 * Register a new user.
 *
 * POST /api/auth/register
 */
export const registerUser = async (userData) => {
    const response = await api.post(
        "/api/auth/register",
        userData
    );

    return response.data;
};

/**
 * Login an existing user.
 *
 * POST /api/auth/login
 */
export const loginUser = async (credentials) => {
    const response = await api.post(
        "/api/auth/login",
        credentials
    );

    return response.data;
};

/**
 * Logout the current user.
 *
 * The backend does not define a logout endpoint.
 * JWT authentication is stateless, so logout is handled
 * on the frontend by removing the stored token.
 */
export const logoutUser = () => {
    localStorage.removeItem("craftpass_token");
};