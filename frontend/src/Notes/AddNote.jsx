import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function AddNote() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    // const apiUrl = "http://localhost:7125/";
    const apiUrl = "https://myspace-k46b.onrender.com/";

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${apiUrl}notes/add`,
                { title, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("Note added successfully!");
            setTitle('');
            setDescription('');

            setTimeout(() => {
                navigate('/notes');
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to add note.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-200 to-violet-400 p-6 flex items-center">
            <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 ">
                <NavLink to={'/notes'} className="flex items-center space-x-2 mb-6 hover:text-blue-800">
                    <FaArrowLeft size={20} />
                    <span>Back to Notes</span>
                </NavLink>

                <h2 className="text-2xl font-semibold mb-6 text-center">Add New Note</h2>

                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 p-2 block w-full border-orange-500 rounded-md shadow-sm sm:text-sm outline-none"
                            
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="10"
                            className="mt-1 p-2 block w-full border-orange-500 rounded-md shadow-sm sm:text-sm outline-none"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                description.trim()
                                    ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!description.trim()} 
                        >
                            Add Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNote;