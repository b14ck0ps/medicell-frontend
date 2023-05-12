"use client";
import axios, { AxiosInstance } from 'axios';

const baseURL = 'https://localhost:44326/api/';

// Create Axios instance with authentication configuration
const createAxiosInstance = (): AxiosInstance => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const instance = axios.create({
        baseURL,
        headers: {
            Authorization: token ? token : '',
            'Content-Type': 'application/json',
        },
    });

    return instance;
};

// Export the configured Axios instance
const axiosInstance = createAxiosInstance();
export default axiosInstance;
