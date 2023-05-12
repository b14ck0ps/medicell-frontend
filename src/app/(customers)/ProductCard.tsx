"use client";
import { Product } from '@/interfaces';
import axiosInstance from '@/lib/axiosInstance';
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axiosInstance.get('products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleAddToCart = (productId: number) => {
        // Retrieve the cart data from sessionStorage
        const cartData = sessionStorage.getItem('cart');
        let cartItems = cartData ? JSON.parse(cartData) : [];

        // Check if the product is already in the cart
        const existingProduct = cartItems.find((item: { id: number }) => item.id === productId);

        if (existingProduct) {
            // Product already exists in the cart, increase the quantity
            existingProduct.quantity += 1;

            // Update the cart data in sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cartItems));
            toast.success('Quantity of product increased in the cart.');

        } else {
            // Product doesn't exist in the cart, add it as a new item
            const newProduct = { id: productId, quantity: 1 };
            cartItems = [...cartItems, newProduct];

            // Update the cart data in sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cartItems));
            toast.success('Product added to cart.');
        }
        setTimeout(() => {
            // Reload the page
            // This is the worst way to do it, but for now it's the only way. I'll fix it later when i learn more about React redux and context
            window.location.reload();
        }, 500);
    };

    return (
        <div className="flex flex-wrap justify-center">
            {products.map(product => (
                <div key={product.Id} className="max-w-sm mx-2 my-2 overflow-hidden bg-white rounded-lg shadow-md">
                    <Link href="/product/[id]" as={`/product/${product.Id}`} key={product.Id}>
                        <img className="object-cover w-full h-48 transition hover:transform hover:scale-105" src={product.ImageUrl} alt={product.Name} />
                    </Link>
                    <div className="p-4">
                        <h3 className="mb-2 text-xl font-medium">{product.Name}</h3>
                        <p className="text-gray-700 truncate">{product.Description}</p>
                        <div className="flex items-center justify-between mt-4">
                            <span className="font-bold text-gray-900">${product.Price}</span>
                            <span className={product.IsAvailable ? 'text-green-500' : 'text-red-500'}>
                                {product.IsAvailable ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <button
                            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={() => handleAddToCart(product.Id)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
            <ToastContainer position="bottom-left" />
        </div>
    );
};
export default ProductCard;