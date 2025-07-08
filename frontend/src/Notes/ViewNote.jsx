import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { FaArrowLeft } from 'react-icons/fa';

function ViewNote() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const apiUrl = "http://localhost:7125/";
    const apiUrl = "https://taskmap-backend.onrender.com/";
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        const fetchNote = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}notes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNote(response.data);
                setEditedTitle(response.data.title);
                setEditedDescription(response.data.description);
            } catch (err) {
                setError(err.message || 'Failed to fetch note.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const clickedDelete = () => {
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const deleteNote = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiUrl}notes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/notes');
        } catch (err) {
            setError(err.message || 'Failed to delete note.');
        } finally {
            closeDeleteConfirm();
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const saveNote = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${apiUrl}notes/${id}`,
                { title: editedTitle, description: editedDescription },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNote(response.data);
            setEditedTitle(response.data.title);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update note.');
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditedTitle(note.title);
        setEditedDescription(note.description);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner /> <span className="ml-3">Loading note...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600 italic mt-4 m-5">Error loading note: {error}</div>;
    }

    if (!note) {
        return <div className="text-gray-600 italic mt-4 m-5">Note not found.</div>;
    }

    return (
        <div className="h-screen bg-gradient-to-r from-violet-200 to-violet-400 p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <NavLink to="/notes" className="flex items-center mb-4 hover:text-blue-700">
                    <FaArrowLeft className="mr-2" /> Back to notes
                </NavLink>
                <div className="mb-4">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="text-2xl font-semibold text-gray-800 p-2 w-full border border-orange-400 rounded-lg outline-orange-500"
                            placeholder='Title'
                        />
                    ) : (
                        <h2 className="text-2xl font-semibold text-gray-800">{note.title}</h2>
                    )}
                </div>
                {isEditing ? (
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="text-gray-700 mb-4 p-2 w-full border rounded-lg"
                        rows="10"
                    />
                ) : (
                    <pre className="text-gray-700 mb-4">{note.description}</pre>
                )}
                <p className="text-sm text-gray-500">Created at: {formatDate(note.createdAt)}</p>

                <div className="mt-6 flex justify-end">
                    <div>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={saveNote}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleEditClick}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={clickedDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {showDeleteConfirm && (
                <div className="fixed  inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <p className="mb-6 text-lg text-center font-semibold">
                            Are you sure you want to delete this note?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl text-lg"
                                onClick={closeDeleteConfirm}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-semibold"
                                onClick={deleteNote}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewNote;