import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Profile from "../assets/p.png";
import Spinner from "../components/Spinner";
import { NavLink } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

function MySpace() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                console.log(response.data.foundUser);
                
                setUserData(response.data.foundUser);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    if (!userData) {
        return <div className="p-4">User data not found.</div>;
    }

    return (
        <div className="h-screen w-full overflow-y-auto  bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 ">
            <NavLink
                to="/post/add"
                className="fixed bottom-5 right-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 p-4 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex items-center justify-center space-x-2 text-white"
                aria-label="Add contact"
            >
                <div className="font-semibold text-lg">New</div>
                <FaPlus className="text-xl" />
            </NavLink>
            <div className='bg-whiteshadow-xl w-full shadow-2xl rounded-b-lg bg-white'>
                <h2 className="text-3xl font-serif bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white p-2 rounded-b-lg text-center ">
                    Welcome {userData.name}
                </h2>
                <div className='flex flex-col md:flex-row p-3 space-x-6'>
                    <div className='flex space-y-4 md:space-y-0 space-x-6 md:w-1/2'>
                        <div className="flex justify-center w-50 h-50">
                            {userData.pic ? (
                                <img src={userData.pic} alt="Profile" className="w-50 h-50 rounded-full object-cover shadow-md" />
                            ) : (
                                <img src={Profile} alt="Default Profile" className="w-50 h-50 rounded-full object-cover shadow-md" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">User Information</h3>
                            <p className="text-gray-600">Email: {userData.email}</p>
                            {userData.phone && <p className="text-gray-600">Phone: {userData.phone}</p>}
                            {userData.dob && <p className="text-gray-600">DoB: {userData.dob}</p>}
                        </div>
                    </div>
                    <div className='md:flex-grow md:max-w-1/2 items-center' >
                        <div className='grid grid-cols-2  gap-4'>
                            <NavLink to="/notes" className='items-center text-center bg-gradient-to-r from-fuchsia-400 to-violet-500 p-3 rounded-xl shadow-sm'>
                                <div className='text-md font-semibold text-white'>Notes</div>
                                <div className='text-white'>{userData.notes?.length || 0}</div>
                            </NavLink>
                            <NavLink to="/contacts" className='items-center text-center bg-gradient-to-r from-fuchsia-400 to-violet-500 p-3 rounded-xl shadow-sm'>
                                <div className='text-md font-semibold text-white'>Contacts</div>
                                <div className='text-white'>{userData.contacts?.length || 0}</div>
                            </NavLink>
                            <div className='items-center text-center bg-gradient-to-r from-fuchsia-400 to-violet-500 p-3 rounded-xl shadow-sm'>
                                <div className='text-md font-semibold text-white'>Posts</div>
                                <div className='text-white'>{userData.posts?.length || 0}</div>
                            </div>
                            <NavLink to="/events" className='items-center text-center bg-gradient-to-r from-fuchsia-400 to-violet-500 p-3 rounded-xl shadow-sm'>
                                <div className='text-md font-semibold text-white'>Events</div>
                                <div className='text-white'>{userData.events?.length || 0}</div>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {userData.posts && userData.posts.map(post => (
                    <div key={post._id}>
                        {post.pic && <img src={post.pic} alt="Post" className="w-50 h-50 object-cover rounded-md mb-2" />}
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}

export default MySpace;