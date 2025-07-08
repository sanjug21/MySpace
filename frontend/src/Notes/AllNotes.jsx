import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { FaPlus } from 'react-icons/fa';
import defaultProfile from '../assets/p.png';

function AllNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [userImageUrl, setUserImageUrl] = useState(null);

    const apiUrl = "http://localhost:7125/";

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiUrl}notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(response.data);
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserName(decodedToken.name || 'User');
            setUserImageUrl(decodedToken.pic);
        } catch (err) {
            setError(err.message || 'Failed to fetch notes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="h-screen ">
            <div className='w-full p-3 h-12 bg-gradient-to-r from-orange-500 to-orange-400 flex justify-between items-center shadow-md'>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={userImageUrl || defaultProfile} alt="User Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="">
                        Welcome {userName}
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-[calc(100vh-64px)] space-x-3">
                    <Spinner /> <span className="text-gray-700">Loading notes...</span>
                </div>
            ) : error ? (
                <div className="text-red-600 italic mt-4 m-5">Error loading notes: {error}</div>
            ) : (
                <div className="p-6">
                    <NavLink
                        to={'add'}
                        className="fixed bottom-5 right-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 p-4 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex items-center justify-center space-x-2 text-white"
                        aria-label="Add note"
                    >
                        <div className="font-semibold text-lg">New</div>
                        <FaPlus className="text-xl" />
                    </NavLink>
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes.map((note) => (
                                <div
                                    key={note._id}
                                    className="bg-white rounded-lg shadow-lg p-5 transition-shadow duration-300 ease-in-out hover:shadow-2xl"
                                >
                                    <Link
                                        to={`/notes/view/${note._id}`}
                                        className="block"
                                    >
                                        <div className="text-lg font-semibold text-gray-800 mb-2">{note.title}</div>
                                        <div className="text-sm text-gray-600 line-clamp-3 mb-3">{note.description}</div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-8">
                            <p className="text-gray-600 italic">No notes available.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AllNotes;