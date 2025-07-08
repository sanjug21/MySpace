import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Profile from "../assets/p.png";
import Spinner from "../components/Spinner";
import { NavLink, useNavigate } from 'react-router-dom';
import { FaPlus, FaCog } from 'react-icons/fa';

function MySpace() {
    const [userData, setUserData] = useState(null);
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

                // const response = await axios.get(`http://localhost:7125/auth/${userId}/details`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });
                const response = await axios.get(`https://taskmap-backend.onrender.com/auth/${userId}/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                
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
        return <div className="text-red-700 bg-red-100 border border-red-200 p-4 rounded-md mx-auto my-8 max-w-lg shadow-md text-center">Error: {error}</div>;
    }

    if (!userData) {
        return <div className="p-4 text-center text-gray-600">User data not found.</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const viewPost = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className="h-screen bg-gray-50 text-gray-800 font-sans overflow-y-auto">
            <NavLink
                to="/post/add"
                className="fixed bottom-6 right-6 rounded-full bg-gradient-to-r from-teal-600 to-teal-800 p-4 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 flex items-center justify-center space-x-2 text-white z-50"
                aria-label="Add new post"
            >
                <div className="font-semibold text-lg">New Post</div>
                <FaPlus className="text-xl" />
            </NavLink>

            <div className='bg-white shadow-xl rounded-b-lg relative'>
                <h2 className="text-3xl font-serif bg-black text-white p-2 rounded-b-lg text-center shadow-md flex items-center justify-center relative">
                    Welcome, {userData.name}!
                    <button
                        onClick={() => navigate('/user/details')}
                        className="absolute right-4 text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Settings"
                    >
                        <FaCog className="text-2xl" />
                    </button>
                </h2>
                <div className='flex flex-col md:flex-row items-start md:space-x-8 p-4'>
                    <div className='flex flex-col items-center md:items-start space-y-6 md:w-1/3 mb-8 md:mb-0'>
                        <div className="flex-shrink-0 w-48 h-48 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
                            {userData.pic ? (
                                <img src={userData.pic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <img src={Profile} alt="Default Profile" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Personal Information</h3>
                            <p className="text-gray-700 text-lg">Email: <span className="font-medium text-gray-800">{userData.email}</span></p>
                            {userData.phone && <p className="text-gray-700 text-lg">Phone: <span className="font-medium text-gray-800">{userData.phone}</span></p>}
                            {userData.dob && <p className="text-gray-700 text-lg">DoB: <span className="font-medium text-gray-800">{formatDate(userData.dob)}</span></p>}
                        </div>
                    </div>
                    <div className='md:flex-grow md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6'>
                        <NavLink to="/notes" className='flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 p-4 rounded-xl shadow-md transform hover:scale-102 text-white'>
                            <div className='text-lg font-bold mb-1'>Notes</div>
                            <div className='text-2xl font-extrabold text-white'>{userData.notes?.length || 0}</div>
                        </NavLink>
                        <NavLink to="/contacts" className='flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 p-4 rounded-xl shadow-md transform hover:scale-102 text-white'>
                            <div className='text-lg font-bold mb-1'>Contacts</div>
                            <div className='text-2xl font-extrabold text-white'>{userData.contacts?.length || 0}</div>
                        </NavLink>
                        <div className='flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 p-4 rounded-xl shadow-md text-white'>
                            <div className='text-lg font-bold mb-1'>Posts</div>
                            <div className='text-2xl font-extrabold text-white'>{userData.posts?.length || 0}</div>
                        </div>
                        <NavLink to="/events" className='flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 p-4 rounded-xl shadow-md transform hover:scale-102 text-white'>
                            <div className='text-lg font-bold mb-1'>Events</div>
                            <div className='text-2xl font-extrabold text-white'>{userData.events?.length || 0}</div>
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-3xl font-semibold mb-6 text-gray-900 border-b-2 border-blue-400 pb-2">Your Latest Posts</h3>
                {userData.posts && userData.posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {userData.posts.map(post => (
                            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-102 hover:shadow-lg border border-gray-200">
                                {post.pic && (
                                    <img src={post.pic} alt="Post" className="w-full h-48 object-cover" />
                                )}
                                <div className="p-4">
                                    <p className="text-lg font-medium text-gray-900 truncate">{post.title || 'Untitled Post'}</p>
                                    <p className="text-sm text-gray-600 mt-1">{formatDate(post.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-lg text-center py-8">You haven't created any posts yet. Click "New Post" to get started!</p>
                )}
            </div>
        </div>
    );
}

export default MySpace;