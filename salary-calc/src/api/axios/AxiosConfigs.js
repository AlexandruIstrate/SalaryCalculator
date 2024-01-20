import axios from "axios"

// Check that environment variables have been set
if (!process.env.REACT_APP_WORLD_BANK_API_URL) {
    console.error("Backend API URL has not been set. Make sure you followed the setup and created an .env file.");
}

// Create the API object
export const api = axios.create({
    withCredentials: false,
    baseURL: process.env.REACT_APP_WORLD_BANK_API_URL
});

// Define custom error handlers fot the API
const errorHandler = (error) => {
    // Get the response status code
    const statusCode = error.response?.status

    // Log all errors besides 401
    if (statusCode && statusCode !== 401) {
        console.error(error);
    }

    return Promise.reject(error)
}

// Register the custom error handler to the Axios instance
api.interceptors.response.use(undefined, (error) => {
    return errorHandler(error)
})
