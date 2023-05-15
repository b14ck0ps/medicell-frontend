"use client";
import withAuth from '@/app/withAuth';
import { Order } from '@/interfaces';
import { formatDate } from '@/lib/FormatedDateTime';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const OrdersTable: React.FC = () => {
    const [id, setId] = useState<number>(0);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchUser = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await axiosInstance.post('/auth/user', { Tkey: token });
        setId(response.data.Id);
    };

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get(`/order/customer/${id}`);
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (id !== 0) {
            fetchOrders();
        }
    }, [id]);

    return (
        <div className='mx-32 mt-2'>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Order ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Order Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>

                        {orders.map((order) => (
                            <tr key={order.Id} className="bg-white border-b ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {order.Id}
                                </th>
                                <td className="px-6 py-4">
                                    {formatDate(order.OderDate)}
                                </td>
                                <td className="px-6 py-4">
                                    {order.Total}  Taka
                                </td>
                                <td>
                                    <Link className='text-blue-500' href={`/order/${order.Id}`}>Details</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <a href="/" className="flex mt-10 text-sm font-semibold text-indigo-600">
                <svg className="w-4 mr-2 text-indigo-600 fill-current" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                Go Back
            </a>
        </div>
    );
};

export default withAuth(OrdersTable);
