"use client";
import withAuth from '@/app/withAuth';
import { Props } from '@/interfaces';
import { formatDate } from '@/lib/FormatedDateTime';
import axiosInstance from '@/lib/axiosInstance';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';

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

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('MediCell', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(formatDate(order.OderDate), doc.internal.pageSize.getWidth() - 20, 10, { align: 'right' });
        doc.text(`Order Details - Order #${params.id}`, 10, 10);

        const totalPrice = orders.reduce((total, order) => total + order.Quantity * order.ProductPrice, 0);

        const tableData = [
            ...orders.map(order => [
                order.ProductName,
                order.Quantity,
                order.ProductPrice,
                order.Quantity * order.ProductPrice,
            ]),
            ['', '', 'Total Price', totalPrice],
        ];

        // @ts-ignore
        doc.autoTable({
            head: [['Product Name', 'Quantity', 'Price', 'Total Price']],
            body: tableData,
        });

        doc.save(`order_${params.id}.pdf`);
    };


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
            <button
                className='flex items-center float-right mt-4 font-semibold text-indigo-700 hover:text-indigo-500'
                onClick={handleDownloadPDF}
            >
                <svg className='w-10' xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 64" id="pdf-file"><path fill="#edeeef" d="M53.42,10.15v43.7a2,2,0,0,1-2,2H20.14a2,2,0,0,1-2-2V23.09l11-14.94H51.42A2,2,0,0,1,53.42,10.15Z"></path><path fill="#cfd0d1" d="M29.14,8.17V21a2,2,0,0,1-2,2H18.19Z"></path><rect width="31.32" height="14.04" x="10.58" y="35.47" fill="#ff3717" rx="2"></rect><path fill="#edeeef" d="M20.74 43.3v2.16H19V39.53H21.4a3.28 3.28 0 0 1 1.37.22 1.71 1.71 0 0 1 .75.66 1.9 1.9 0 0 1 .27 1 1.76 1.76 0 0 1-.56 1.37 2.13 2.13 0 0 1-1.51.52zm0-1.27h.58c.51 0 .76-.2.76-.59s-.23-.56-.7-.56h-.64zM24.44 45.46V39.53h2.19a2.56 2.56 0 0 1 2.13.88 3.16 3.16 0 0 1 .71 2.05 3 3 0 0 1-.76 2.16 2.55 2.55 0 0 1-2 .84zm1.74-1.37h.45a.85.85 0 0 0 .73-.44 2.16 2.16 0 0 0 .29-1.19 2.34 2.34 0 0 0-.26-1.12.83.83 0 0 0-.76-.46h-.45zM33.74 43.24H31.9v2.22H30.21V39.53H34.3v1.41H31.9v1h1.84z"></path></svg>
                <p className='w-30'>Download PDF</p>
            </button>
            <a href="/orders" className="flex mt-10 text-sm font-semibold text-indigo-600">
                <svg className="w-4 mr-2 text-indigo-600 fill-current" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                Go Back
            </a>
        </div>
    );
};

export default withAuth(ProductOrder);
