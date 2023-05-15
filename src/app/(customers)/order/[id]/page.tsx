"use client";
import { Props } from '@/interfaces';
import axiosInstance from '@/lib/axiosInstance';
import React, { useEffect, useState } from 'react';

interface Order {
    Id: number;
    OderDate: string;
    Total: number;
}

function ProductOrder({ params }: Props) {
    const [orders, setOrders] = useState<any[]>([]);
    const [order, setOrder] = useState<Order>({ Id: 0, OderDate: '', Total: 0 });

    useEffect(() => {

        //Fetch Order by ID
        const fetchOrder = async () => {
            try {
                const response = await axiosInstance.get(`/order/${params.id}`);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        // Fetch the product orders
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get(`/productorder/order/${params.id}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrder();
        fetchOrders();
    }, [params.id]);

    return (
        <div className='mx-56 mt-2'>
            <h1 className="mb-5 text-3xl font-semibold text-gray-900">Orders # {params.id}</h1>
            <div className="flex justify-between mb-3">
                <div className="flex">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500">Order Date:</span>
                        <span className="text-sm font-semibold text-gray-500">Total:</span>
                    </div>
                    <div className="flex flex-col ml-5">
                        <span className="text-sm font-semibold text-gray-500">{new Date(order.OderDate).toLocaleDateString()}</span>
                        <span className="text-sm font-semibold text-gray-500">{order.Total} Taka</span>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500">Deliverd By:</span>
                    </div>
                    <div className="flex flex-col ml-5">
                        <span className="text-sm font-semibold text-gray-500">Delivery Man</span>
                    </div>
                </div>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Toatal Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {orders.map((order) => (
                            <tr key={order.Id} className="bg-white border-b ">
                                <td className="px-6 py-4">
                                    {order.ProductName}
                                </td>
                                <td className="px-6 py-4">
                                    {order.Quantity}
                                </td>
                                <td className="px-6 py-4">
                                    {order.ProductPrice}
                                </td>
                                <td className="px-6 py-4">
                                    {order.Quantity * order.ProductPrice}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <a href="/orders" className="flex mt-10 text-sm font-semibold text-indigo-600">
                <svg className="w-4 mr-2 text-indigo-600 fill-current" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                Go Back
            </a>
        </div>
    );
};

export default ProductOrder;
