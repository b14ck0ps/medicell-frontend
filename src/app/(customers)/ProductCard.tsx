"use client";
import { Product } from '@/interfaces';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortByPrice, setSortByPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        axiosInstance
            .get('products')
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

    const filteredProducts = products
        .filter(product =>
            product.Name.toLowerCase().replace(/\s/g, '').includes(searchTerm.toLowerCase().replace(/\s/g, ''))
        )
        .sort((a, b) => {
            if (sortByPrice === 'lowToHigh') {
                return a.Price - b.Price;
            } else if (sortByPrice === 'highToLow') {
                return b.Price - a.Price;
            }
            return 0;
        });

    const handleSortByPriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortByPrice(event.target.value);
    };

    // Calculate pagination related variables
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="flex items-center justify-around mt-4 mx-96">
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    className="flex-1 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />

                {/* Sort select options */}
                <select
                    value={sortByPrice}
                    onChange={event => setSortByPrice(event.target.value)}
                    className="px-4 py-2 ml-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                >
                    <option value="">Sort by Price</option>
                    <option value="lowToHigh">Low to High</option>
                    <option value="highToLow">High to Low</option>
                </select>
            </div>

            <div className="flex flex-wrap justify-center mt-4">
                {currentProducts.map(product => (
                    <div key={product.Id} className="max-w-[15rem] mx-2 my-2 overflow-hidden bg-white rounded-lg shadow-md">
                        <Link href="/product/[id]" as={`/product/${product.Id}`} key={product.Id}>
                            <img
                                className="object-cover w-full h-48 transition hover:transform hover:scale-105"
                                src={product.ImageUrl}
                                alt={product.Name}
                            />
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
            </div>

            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <ToastContainer position="bottom-left" />
        </div>
    );

};

export default ProductCard;
