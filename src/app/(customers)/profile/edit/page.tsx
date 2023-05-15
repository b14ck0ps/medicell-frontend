"use client";
import withAuth from '@/app/withAuth';
import axiosInstance from '@/lib/axiosInstance';
import React, { useEffect, useState } from 'react';

const ProfilePage: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Id: 0,
        FirstName: '',
        LastName: '',
        Gender: 0,
        DateOfBirth: '',
        Email: '',
        Phone: '',
        ProfilePicture: "",
        Address: '',
        Password: '',
        Role: 1, // 1 for customer
    });

    useEffect(() => {
        // Fetch user data from the API
        const fetchUser = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const response = await axiosInstance.post('/auth/user', { Tkey: token });
                setFormData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    const [formErrors, setFormErrors] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: '',
        Address: '',
        Password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };



    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Reset form errors
        setFormErrors({
            FirstName: '',
            LastName: '',
            Email: '',
            Phone: '',
            Address: '',
            Password: '',
        });

        axiosInstance.patch('user', formData)
            .then(response => {
                setLoading(true);
                window.location.href = '/profile';
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.ModelState) {
                    const errors = error.response.data.ModelState;
                    // Update form errors based on the response
                    setFormErrors(prevState => ({
                        ...prevState,
                        FirstName: errors["customer.FirstName"] ? errors["customer.FirstName"][0] : '',
                        LastName: errors["customer.LastName"] ? errors["customer.LastName"][0] : '',
                        Email: errors["customer.Email"] ? errors["customer.Email"][0] : '',
                        Phone: errors["customer.Phone"] ? errors["customer.Phone"][0] : '',
                        Address: errors["customer.Address"] ? errors["customer.Address"][0] : '',
                        Password: errors["customer.Password"] ? errors["customer.Password"][0] : '',
                    }));
                }
                console.error(error);
            });
    };

    return (
        <div className="max-w-md p-4 mx-auto mt-8 bg-white rounded-lg shadow-md">
            <form className={`${loading ? 'opacity-30' : ''}`} onSubmit={handleSubmit}>
                <div>
                    <img src={formData.ProfilePicture ? formData.ProfilePicture : 'https://transplant.org.au/wp-content/uploads/2018/06/James-avatar-for-website.png'} alt="Avatar" className="w-24 h-24 mx-auto mb-3 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block font-medium">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="FirstName"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={formData.FirstName}
                            onChange={handleChange}
                        />
                        {formErrors.FirstName && <p className="mt-1 text-xs text-red-500">{formErrors.FirstName}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block font-medium">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="LastName"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={formData.LastName}
                            onChange={handleChange}
                        />
                        {formErrors.LastName && <p className="mt-1 text-xs text-red-500">{formErrors.LastName}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1/2 mb-4">
                        <label htmlFor="gender" className="block mb-2 font-medium">Gender</label>
                        <select
                            id="gender"
                            name="Gender"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={formData.Gender}
                            onChange={handleChange}
                            required
                        >
                            <option value={0}>Male</option>
                            <option value={1}>Female</option>
                        </select>
                    </div>
                    <div className="w-1/2 mb-4">
                        <label htmlFor="dob" className="block mb-2 font-medium">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="DateOfBirth"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={formData.DateOfBirth.slice(0, 10)}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="Email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.Email}
                        onChange={handleChange}
                    />
                    {formErrors.Email && <p className="mt-1 text-xs text-red-500">{formErrors.Email}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block font-medium">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="Phone"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.Phone}
                        onChange={handleChange}
                    />
                    {formErrors.Phone && <p className="mt-1 text-xs text-red-500">{formErrors.Phone}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block font-medium">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="Address"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.Address}
                        onChange={handleChange}
                    />
                    {formErrors.Address && <p className="mt-1 text-xs text-red-500">{formErrors.Address}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="Password"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.Password}
                        onChange={handleChange}
                    />
                    {formErrors.Password && <p className="mt-1 text-xs text-red-500">{formErrors.Password}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block font-medium">Profile Picture</label>
                    <input
                        type="file"
                        id="profilePicture"
                        name="ProfilePicture"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.ProfilePicture}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Update
                    </button>
                    <a href="/profile" className="flex mt-10 text-sm font-semibold text-indigo-600">

                        <svg className="w-4 mr-2 text-indigo-600 fill-current" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                        Go Back
                    </a>
                </div>
            </form>
            {loading && <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                <span className="sr-only">Loading...</span>
            </div>}
        </div>
    );
};

export default withAuth(ProfilePage);