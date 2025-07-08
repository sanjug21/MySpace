import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Profile from '../assets/p.png';
import { FaSearch, FaTimes, FaPlus } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { jwtDecode } from 'jwt-decode';

function AllContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [text, setText] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [userName, setUserName] = useState('');
    const [userImageUrl, setUserImageUrl] = useState(null);
    const apiUrl = "http://localhost:7125/";

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token missing.');
                setLoading(false);
                return;
            }
            const response = await axios.get(`${apiUrl}contacts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContacts(response.data);
            setLoading(false);
            try {
                const decodedToken = jwtDecode(token);
                setUserName(decodedToken.name || 'User');
                setUserImageUrl(decodedToken.pic);
            } catch (decodeError) {
                console.error('Error decoding token:', decodeError);
                setUserName('User');
                setUserImageUrl(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error fetching contacts.');
            setLoading(false);
            console.error('Error fetching contacts:', err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        const trimmedText = text.trim();
        if (trimmedText) {
            const results = contacts.filter((contact) =>
                contact.name.toLowerCase().includes(trimmedText.toLowerCase()) ||
                (contact.phone && (contact.phone.personal && contact.phone.personal.includes(trimmedText)) || (contact.phone.work && contact.phone.work.includes(trimmedText)))
            );
            setFilteredContacts(results);
        } else {
            setFilteredContacts(contacts);
        }
    }, [text, contacts]);

    return (
        <div className='h-screen '>
            <div className='w-full p-3 align-middle h-12 bg-gradient-to-r from-orange-500 to-orange-400 flex justify-between items-center transition-shadow duration-300 ease-in-out'>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={userImageUrl || Profile} alt="User Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        Welcome {userName}
                    </div>
                </div>
                <div className="flex items-center">
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="p-1.5 border border-orange-500 rounded-xl outline-none mr-2 focus:border-orange-500 shadow-md transition-shadow duration-300 ease-in-out focus:shadow-lg"
                        />
                    )}
                    <button onClick={() => { setShowSearch(!showSearch); setText("") }} className="transition-transform transform hover:scale-110">
                        {showSearch ? <FaTimes /> : <FaSearch />}
                    </button>
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="m-4">{error}</div>
            ) : (
                <>
                    <NavLink
                        to={'add'}
                        className="fixed bottom-5 right-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 p-4 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex items-center justify-center space-x-2 text-white"
                        aria-label="Add contact"
                    >
                        <div className="font-semibold text-lg">New</div>
                        <FaPlus className="text-xl" />
                    </NavLink>
                    {filteredContacts.length > 0 ? (
                        <div className="space-y-2 m-2 ">
                            {filteredContacts.map((contact) => (
                                <NavLink key={contact._id} to={`view/${contact._id}`} className="block rounded-xl p-3 hover:shadow-2xl hover:bg-slate-200 transition-colors duration-200">
                                    <div className="flex justify-between">
                                        <div className="flex space-x-3">
                                            <div className="flex justify-center items-center">
                                                <div className="w-10 h-10 rounded-full overflow-hidden ">
                                                    <img src={contact.imageUrl || Profile} alt="Contact Profile" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xl ">{contact.name}</div>
                                                <div className="text-sm text-gray-500">{contact.phone && (contact.phone.personal || contact.phone.work)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-8">
                            <p className="text-gray-600 italic">No contacts found.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AllContacts;