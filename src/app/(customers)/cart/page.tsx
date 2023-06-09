"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import withAuth from '@/app/withAuth';

const CartTable: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cartData = sessionStorage.getItem('cart');
        const parsedCartData = cartData ? JSON.parse(cartData) : [];
        setCartItems(parsedCartData);

        fetchProductDetails(parsedCartData);
    }, []);

    const fetchProductDetails = async (cartItems: any[]) => {
        try {
            const productIds = cartItems.map((item) => item.id);
            const response = await axiosInstance.get('products');
            const allProducts = response.data;
            const selectedProducts = allProducts.filter((product: any) =>
                productIds.includes(product.Id)
            );
            setProducts(selectedProducts);

            // Calculate total items and total price
            let itemsCount = 0;
            let totalPriceValue = 0;
            selectedProducts.forEach((product: any) => {
                const cartItem = cartItems.find((item) => item.id === product.Id);
                const quantity = cartItem ? cartItem.quantity : 0;
                itemsCount += quantity;
                totalPriceValue += product.Price * quantity;
            });
            setTotalItems(itemsCount);
            setTotalPrice(totalPriceValue);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = (productId: number) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== productId);
        setCartItems(updatedCartItems);
        updateSessionStorage(updatedCartItems);
        fetchProductDetails(updatedCartItems);
    };

    const updateSessionStorage = (cartItems: any[]) => {
        const cartData = JSON.stringify(cartItems);
        sessionStorage.setItem('cart', cartData);
        window.location.reload();
    };

    const handleIncrease = (productId: number) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === productId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        updateSessionStorage(updatedCartItems);
        fetchProductDetails(updatedCartItems);
    };

    const handleDecrease = (productId: number) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === productId) {
                const newQuantity = item.quantity - 1;
                if (newQuantity > 0) {
                    return { ...item, quantity: newQuantity };
                } else {
                    handleRemove(item.id);
                    return null;
                }
            }
            return item;
        });

        const filteredCartItems = updatedCartItems.filter((item) => item !== null);

        setCartItems(filteredCartItems);
        updateSessionStorage(filteredCartItems);
        fetchProductDetails(filteredCartItems);
    };

    const handleCheckOut = async () => {
        try {
            setLoading(true);
            // Get the user's ID
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const response = await axiosInstance.post('/auth/user', { Tkey: token });
            const orderedBy = response.data.Id;

            // Create the order object
            const order = {
                Total: totalPrice,
                OrderedBy: orderedBy,
            };

            // Send the order request
            const orderResponse = await axiosInstance.post('/order', order);
            const orderId = orderResponse.data;

            // Create the product order objects
            const productOrders = cartItems.map((item) => ({
                Quantity: item.quantity,
                ProductId: item.id,
                OrderId: orderId,
            }));

            // Send the product order request
            await axiosInstance.post('/productorder', productOrders);

            // Clear the cart
            setCartItems([]);
            setTotalItems(0);
            setTotalPrice(0);
            sessionStorage.removeItem('cart');
            window.location.href = '/order/successful';
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            {products.length > 0 ? (
                <div className="container relative mx-auto">
                    <div className={`flex my-10 shadow-md ${loading ? 'opacity-30' : ''}`}>
                        <div className="w-3/4 px-10 py-10 bg-white">
                            <div className="flex justify-between pb-8 border-b">
                                <h1 className="text-2xl font-semibold">Shopping Cart</h1>
                                <h2 className="text-2xl font-semibold">{totalItems} Items</h2>
                            </div>
                            <div className="flex mt-10 mb-5">
                                <h3 className="w-2/5 text-xs font-semibold text-gray-600 uppercase">Product Details</h3>
                                <h3 className="w-1/5 text-xs font-semibold text-center text-gray-600 uppercase">Quantity</h3>
                                <h3 className="w-1/5 text-xs font-semibold text-center text-gray-600 uppercase">Price</h3>
                                <h3 className="w-1/5 text-xs font-semibold text-center text-gray-600 uppercase">Total</h3>
                            </div>
                            <div>
                                {products.map((product) => {
                                    const cartItem = cartItems.find((item) => item.id === product.Id);
                                    const quantity = cartItem ? cartItem.quantity : 0;

                                    return (
                                        <div className="flex items-center px-6 py-5 -mx-8 hover:bg-gray-100">
                                            <div className="flex w-2/5">
                                                <div className="w-20">
                                                    <img className="h-24" src={product.ImageUrl} alt="" />
                                                </div>
                                                <div className="flex flex-col justify-between flex-grow ml-4">
                                                    <span className="text-sm font-bold">{product.Name}</span>
                                                    <span className="text-xs text-red-500">{product.Brand}</span>
                                                    <a onClick={() => handleRemove(product.Id)} className="text-xs font-semibold text-gray-500 hover:cursor-pointer hover:text-red-500">Remove</a>
                                                </div>
                                            </div>
                                            <div className="flex justify-center w-1/5">
                                                <button onClick={() => handleDecrease(product.Id)} className="text-gray-500 focus:outline-none focus:text-gray-600">
                                                    <svg className="w-3 text-gray-600 fill-current" viewBox="0 0 448 512"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                                    </svg>
                                                </button>
                                                <input className="w-8 mx-2 text-center border" type="text" value={quantity} readOnly />
                                                <button onClick={() => handleIncrease(product.Id)} className="text-gray-500 focus:outline-none focus:text-gray-600">
                                                    <svg className="w-3 text-gray-600 fill-current" viewBox="0 0 448 512">
                                                        <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <span className="w-1/5 text-sm font-semibold text-center text-gray-600">{product.Price}</span>
                                            <span className="w-1/5 text-sm font-semibold text-center text-gray-600">{product.Price * quantity}</span>
                                        </div>

                                    );
                                })}

                            </div>

                            <a href="/" className="flex mt-10 text-sm font-semibold text-indigo-600">

                                <svg className="w-4 mr-2 text-indigo-600 fill-current" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                                Continue Shopping
                            </a>
                        </div>

                        <div id="summary" className="w-1/4 px-8 py-10">
                            <h1 className="pb-8 text-2xl font-semibold border-b">Order Summary</h1>
                            <div className="flex justify-between mt-10 mb-5">
                                <span className="text-sm font-semibold uppercase">Items {totalItems}</span>
                                <span className="text-sm font-semibold">{totalPrice}$</span>
                            </div>
                            <div>
                                <label className="inline-block mb-3 text-sm font-medium uppercase">Shipping</label>
                                <select className="block w-full p-2 text-sm text-gray-600">
                                    <option>Standard shipping - $0.00</option>
                                    <option>Premium shipping - $10.00</option>
                                </select>
                            </div>
                            <div className="py-10">
                                <label htmlFor="promo" className="inline-block mb-3 text-sm font-semibold uppercase">Promo Code</label>
                                <input type="text" id="promo" placeholder="Enter your code" className="w-full p-2 text-sm" />
                            </div>
                            <button className="px-5 py-2 text-sm text-white uppercase bg-red-500 hover:bg-red-600">Apply</button>
                            <div className="mt-8 border-t">
                                <div className="flex justify-between py-6 text-sm font-semibold uppercase">
                                    <span>Total cost</span>
                                    <span>${totalPrice}</span>
                                </div>
                                <button
                                    onClick={() => handleCheckOut()}
                                    className="w-full py-3 text-sm font-semibold text-white uppercase bg-indigo-500 hover:bg-indigo-600">Checkout</button>
                            </div>
                        </div>

                    </div>
                    {loading && <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div>}
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-bold">Your cart is empty</h1>
                        <Link href="/" className="px-4 py-2 mt-4 text-white bg-indigo-500 rounded hover:bg-indigo-600">Continue shopping</Link>
                    </div>
                </div>
            )}
        </div >
    );
};

export default withAuth(CartTable);
