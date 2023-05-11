"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface LoginResponse {
    TKey: string;
    CreatedAt: string;
    DeletedAt: string | null;
    UserId: number;
}

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post<LoginResponse>('https://localhost:44326/api/auth/login', {
                email,
                password,
            });

            if (response.status !== 200) {
                setError("Invalid credentials." as string);
            } else {
                // Handle the response data
                localStorage.setItem('token', response.data.TKey);
                window.location.href = '/';
            }
            // Redirect or perform any other actions as needed
        } catch (error) {
            setError("Invalid credentials." as string);
        }
    };

    return (
        <div className="max-w-xs mx-auto mt-28">
            <h1 className="mb-4 text-3xl font-bold text-center">Log In</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                    {error && <p className="mb-4 text-xs italic text-center text-red-500">{error}</p>}
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
