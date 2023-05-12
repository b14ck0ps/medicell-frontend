"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Logout from '@/lib/Logout';

const Navbar: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false);

    useState(() => {
        setIsAuth(localStorage.getItem('token') ? true : false);
    },);

    return (
        <nav className="flex items-center justify-between p-4 text-white bg-gray-900">
            <div className="text-xl font-bold">MediCell</div>
            <ul>
                {isAuth ? (
                    <div className="flex space-x-4">
                        <li>
                            <Link href="/" className="hover:text-gray-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile" className="hover:text-gray-300">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/cart" className="hover:text-gray-300">
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link href="/order" className="hover:text-gray-300">
                                Order
                            </Link>
                        </li>
                        <li>
                            <button onClick={Logout} className="hover:text-red-800">
                                Logout
                            </button>
                        </li>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <li>
                            <Link href="/login" className="hover:text-gray-300">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link href="/register" className="hover:text-gray-300">
                                Register
                            </Link>
                        </li>
                    </div>
                )}
            </ul>

        </nav>
    );
};

export default Navbar;
