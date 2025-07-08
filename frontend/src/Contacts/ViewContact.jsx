import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Profile from '../assets/p.png';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { format } from 'date-fns';

function ViewContact() {
    const { id } = useParams();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const token = localStorage.getItem('token');
    // const apiUrl = "http://localhost:7125/";
    const apiUrl = "https://taskmap-backend.onrender.com/";

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    setError('Authentication token not found.');
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`${apiUrl}contacts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setContact(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token, apiUrl]);

    const openDeleteConfirm = () => {
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const deleteContact = async () => {
        try {
            if (!token) {
                setError('Authentication token not found.');
                closeDeleteConfirm();
                return;
            }

            await axios.delete(`${apiUrl}contacts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/contacts');
            closeDeleteConfirm();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to delete contact.");
            closeDeleteConfirm();
        }
    };

    return (
        <div className="p-5 h-screen space-y-2 bg-gradient-to-r from-violet-200 to-violet-400">
            {loading ? (
                <Spinner />
            ) : error ? (
                <div>Error: {error}</div>
            ) : !contact ? (
                <div>Contact not found.</div>
            ) : (
                <>
                    <NavLink to="/contacts" className="flex items-center mb-4 hover:text-blue-700">
                        <FaArrowLeft className="mr-2" />
                        Back to Contacts
                    </NavLink>
                    <div className="flex justify-center items-center">
                        <div className="w-50 h-50 rounded-full overflow-hidden">
                            <img src={Profile} alt="Contact Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl">
                        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                        <div className="mb-4">
                            <strong className="block text-gray-700 mb-1">Name:</strong>
                            <p className="text-lg">{contact.name}</p>
                        </div>

                        {contact.phone && (
                            <>
                                {contact.phone.personal && (
                                    <div className="mb-4">
                                        <strong className="block text-gray-700 mb-1">Personal Phone:</strong>
                                        <p>{contact.phone.personal}</p>
                                    </div>
                                )}
                                {contact.phone.work && (
                                    <div className="mb-4">
                                        <strong className="block text-gray-700 mb-1">Work Phone:</strong>
                                        <p>{contact.phone.work}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {contact.email && (
                            <>
                                {contact.email.personal && (
                                    <div className="mb-4">
                                        <strong className="block text-gray-700 mb-1">Personal Email:</strong>
                                        <p>{contact.email.personal}</p>
                                    </div>
                                )}
                                {contact.email.work && (
                                    <div className="mb-4">
                                        <strong className="block text-gray-700 mb-1">Work Email:</strong>
                                        <p>{contact.email.work}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {contact.address && (
                            <div className="mb-4">
                                <strong className="block text-gray-700 mb-1">Address:</strong>
                                <p>{contact.address}</p>
                            </div>
                        )}

                        {contact.dob && (
                            <div className="mb-4">
                                <strong className="block text-gray-700 mb-1">Date of Birth:</strong>
                                <p>{format(new Date(contact.dob), 'PP')}</p>
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <NavLink
                                to={`/contacts/edit/${id}`}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl mr-2"
                            >
                                Edit
                            </NavLink>
                            <button
                                onClick={openDeleteConfirm}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 flex items-center justify-center ">
                            <div className="bg-white p-6 rounded-md shadow-lg">
                                <p className="mb-4">Are you sure you want to delete {contact.name}?</p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-xl"
                                        onClick={closeDeleteConfirm}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                        onClick={deleteContact}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ViewContact;