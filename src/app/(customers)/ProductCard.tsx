"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import axiosInstance from '@/lib/axiosInstance';
import { Product } from '@/interfaces';

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
        // Logic for adding the product to the cart
        console.log(`Product ${productId} added to cart.`);
    };

    return (
        <div className="flex flex-wrap justify-center">
            {products.map(product => (
                <div key={product.Id} className="max-w-sm mx-2 my-2 overflow-hidden bg-white rounded-lg shadow-md">
                    <Link href="/product/[id]" as={`/product/${product.Id}`} key={product.Id}>
                        <img className="object-cover w-full h-48" src={product.ImageUrl} alt={product.Name} />
                    </Link>
                    <div className="p-4">
                        <h3 className="mb-2 text-xl font-medium">{product.Name}</h3>
                        <p className="text-gray-700">{product.Description}</p>
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
        </div>
    );
};
export default ProductCard;