import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

function EditContact() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        name: '',
        phone: { personal: '', work: '' },
        email: { personal: '', work: '' },
        address: '',
        dob: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const token = localStorage.getItem('token');
    // const apiUrl = "http://localhost:7125/";
    const apiUrl = "https://myspace-k46b.onrender.com/";

    useEffect(() => {
        const fetchContact = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}contacts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContact(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchContact();
    }, [id, token, apiUrl]);

    const updateContactField = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('email.') || name.startsWith('phone.')) {
            const [field, type] = name.split('.');
            setContact({
                ...contact,
                [field]: { ...contact[field], [type]: value },
            });
        } else {
            setContact({ ...contact, [name]: value });
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const phoneRegex = /^(?:\+91|0)?[0-9]{10}$/;

        if (contact.phone.personal && contact.phone.personal.trim() && !phoneRegex.test(contact.phone.personal)) {
            setError({ message: 'Invalid Personal Phone Number. Must be 10 digits, optionally starting with +91 or 0.' });
            setLoading(false);
            return;
        }

        if (contact.phone.work && contact.phone.work.trim() && !phoneRegex.test(contact.phone.work)) {
            setError({ message: 'Invalid Work Phone Number. Must be 10 digits, optionally starting with +91 or 0.' });
            setLoading(false);
            return;
        }

        try {
            let { _id, __v, createdAt, updatedAt, userId, ...contactData } = contact;

            await axios.put(`${apiUrl}contacts/${id}`, contactData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage('Contact updated successfully!');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = Object.values(err.response.data.errors).map(
                    (error) => error.message
                );
                setError({ message: errorMessages.join(', ') });
            } else if (err.response && err.response.data && err.response.data.message) {
                setError({ message: err.response.data.message });
            } else {
                setError({ message: 'Failed to update contact. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                navigate(`/contacts/view/${id}`);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate, id]);

    return (
        <div className="p-5 overflow-auto h-screen bg-gradient-to-r from-violet-200 to-violet-400">
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {(error || successMessage) && (
                        <div className={`mb-4 p-3 rounded-md ${error ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'} flex justify-between items-center`}>
                            <span>{error ? error.message : successMessage}</span>
                            <button onClick={() => { setError(null); setSuccessMessage(null); }} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                    )}

                    <h2 className="text-2xl font-semibold mb-4">Edit Contact</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" id="name" value={contact.name} onChange={updateContactField} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-700 outline-none p-2 focus:shadow-2xl" aria-label="Contact Name" />
                        </div>

                        <div>
                            <label htmlFor="phone.personal" className="block text-sm font-medium text-gray-700">Personal Phone</label>
                            <input type="tel" name="phone.personal" id="phone.personal" value={contact.phone.personal} onChange={updateContactField} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-700 outline-none p-2 focus:shadow-2xl" aria-label="Personal Phone" />
                        </div>

                        <div>
                            <label htmlFor="phone.work" className="block text-sm font-medium text-gray-700">Work Phone</label>
                            <input type="tel" name="phone.work" id="phone.work" value={contact.phone.work} onChange={updateContactField} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-700 outline-none p-2 focus:shadow-2xl" aria-label="Work Phone" />
                        </div>

                        <div>
                            <label htmlFor="email.personal" className="block text-sm font-medium text-gray-700">Personal Email</label>
                            <input type="email" name="email.personal" id="email.personal" value={contact.email.personal} onChange={updateContactField} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-700 outline-none p-2 focus:shadow-2xl" aria-label="Personal Email" />
                        </div>

                        <div>
                            <label htmlFor="email.work" className="block text-sm font-medium text-gray-700">Work Email</label>
                            <input type="email" name="email.work" id="email.work" value={contact.email.work} onChange={updateContactField} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-700 outline-none p-2 focus:shadow-2xl" aria-label="Work Email" />
                        </div>

                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input type="date" name="dob" id="dob" value={contact.dob ? contact.dob.substring(0, 10) : ''} onChange={updateContactField} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-700 outline-none p-2 focus:shadow-2xl" aria-label="Date of Birth" />
                        </div>
                        <div>
                           <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                           <input type="text" name="address" id="address" value={contact.address} onChange={updateContactField} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-700 outline-none p-2 focus:shadow-2xl" aria-label="Address" />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <NavLink to={`/contacts/view/${id}`} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-xl">Cancel</NavLink>
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl" disabled={loading}>
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default EditContact;