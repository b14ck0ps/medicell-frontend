"use client";
import React, { use } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/interfaces';
import Link from 'next/link';
import withAuth from '@/app/withAuth';

const ProfilePage: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        // Fetch user data from the API
        const fetchUser = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const response = await axiosInstance.post('/auth/user', { Tkey: token });
                setUser(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-center bg-white'>
            <div className='px-20 py-5 mt-10 rounded-md bg-slate-100'>
                <div className="flex items-center gap-4 mb-3">
                    <img className='w-[100px] rounded-md' src={user.ProfilePicture !== "" ? user.ProfilePicture : 'https://transplant.org.au/wp-content/uploads/2018/06/James-avatar-for-website.png'} alt="Profile" />
                    <div>
                        <h3 className='text-xl font-bold'>{`${user.FirstName} ${user.LastName}`}</h3>
                        <p className='flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" id="human"><path d="M11 2C9.35 2 8 3.35 8 5c0 .931.439 1.755 1.11 2.307a6.237 6.237 0 0 0-1.131.488C7.87 6.24 6.58 5 5 5 3.35 5 2 6.35 2 8c0 .936.443 1.763 1.12 2.314A6.424 6.424 0 0 0 .114 12.36L0 12.498v2.488h10V12.49l-.115-.138c-.103-.124-.216-.236-.326-.352H16V9.49l-.115-.138a6.76 6.76 0 0 0-.526-.567 6.367 6.367 0 0 0-2.466-1.48A2.982 2.982 0 0 0 14 5c0-1.65-1.35-3-3-3zm0 1c1.11 0 2 .89 2 2 0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2zM5 6c1.11 0 2 .89 2 2 0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2zm6.188 1.996c.01 0 .02.004.03.004h-.099c.023 0 .046-.005.069-.004zm-.688.04V10h1V8.037c1.13.111 2.243.584 3.166 1.47.117.114.226.237.334.36V11H8.36a6.231 6.231 0 0 0-1.473-.69c.38-.311.69-.707.883-1.167a5.25 5.25 0 0 1 2.73-1.108zm-6 2.985V13h1v-1.979c1.131.113 2.243.6 3.166 1.487.117.113.226.236.334.36v1.118H1v-1.084c.965-1.108 2.208-1.75 3.5-1.88z" color="#000" font-family="sans-serif" font-weight="400" overflow="visible"></path></svg>
                            {user.Gender === 0 ? "Male" : "Female"}</p>
                        <p className='flex gap-2'><svg className="w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                            {user.Address}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <p className='text-sm text-gray-600'>Email Address</p>
                    <p>{user.Email}</p>
                </div>
                <div className="mb-3">
                    <p className='text-sm text-gray-600'>Home Address</p>
                    <p>{user.Address}</p>
                </div>
                <div className="mb-3">
                    <p className='text-sm text-gray-600'>Phone Number</p>
                    <p>{user.Phone}</p>
                </div>
                <div className="mb-3">
                    <p className='text-sm text-gray-600'>Date Of Birth</p>
                    <p>{new Date(user.DateOfBirth).toLocaleDateString()}</p>
                </div>
            </div>
            <Link href="/profile/edit" className='px-5 py-2 m-5 text-white bg-blue-600 rounded-lg hover:bg-blue-800 hover:cursor-pointer' >Edit</Link>
        </div>
    );
};

export default withAuth(ProfilePage);
