"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Logout from '@/lib/Logout';

const Navbar: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    useState(() => {
        setIsAuth(localStorage.getItem('token') ? true : false);

        // Retrieve the cart data from sessionStorage
        const cartData = sessionStorage.getItem('cart');
        const cartItems = cartData ? JSON.parse(cartData) : [];

        // Calculate the total number of items in the cart
        const itemCount = cartItems.reduce((total: number, item: { quantity: number }) => {
            return total + item.quantity;
        }, 0);

        setCartItemCount(itemCount);
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
                                <span className="relative">
                                    Cart
                                    {cartItemCount > 0 && (
                                        <span className="absolute inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full -right-3 -top-4">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </span>
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
