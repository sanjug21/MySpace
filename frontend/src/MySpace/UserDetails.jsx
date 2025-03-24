import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function UserDetails() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in.');
                    setLoading(false);
                    return;
                }
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;

                const response = await axios.get(`http://localhost:7125/auth/${userId}/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { name, email, phone, dob } = response.data.foundUser;
                setUserData({ name, email, phone, dob: dob ? dob.split('T')[0] : '' });
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const change = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const updateDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            await axios.put(`http://localhost:7125/auth/${userId}/update`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update user data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 md:w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="flex items-center mb-4">
                        <button onClick={() => navigate(-1)} className="flex items-center">
                            <FaArrowLeft className="mr-2" />
                        </button>
                        <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 ml-4">Edit User Details</h1>
                    </div>
                    <form onSubmit={updateDetails} className="mt-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" name="name" value={userData.name} onChange={change} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" name="email" value={userData.email} onChange={change} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone</label>
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" placeholder="Phone" name="phone" value={userData.phone} onChange={change} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">Date of Birth</label>
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="dob" type="date" name="dob" value={userData.dob} onChange={change} />
                        </div>

                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" type="submit">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;