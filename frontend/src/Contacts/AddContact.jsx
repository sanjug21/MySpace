import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function AddContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: { personal: '', work: '' },
    phone: { personal: '', work: '' },
    address: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // const apiUrl = "http://localhost:7125/";
  const apiUrl = "https://myspace-k46b.onrender.com/";
  const topRef = useRef(null);
  const isPhoneEmpty = !formData.phone.personal && !formData.phone.work;

  useEffect(() => {
    if (error || successMessage) {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, [error, successMessage]);

  const change = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('email.') || name.startsWith('phone.')) {
      const [field, type] = name.split('.');
      setFormData({
        ...formData,
        [field]: { ...formData[field], [type]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.name && (formData.phone.personal || formData.phone.work)) {
      formData.name = formData.phone.personal || formData.phone.work;
    }
    const phoneRegex = /^(?:\+91|0)?[0-9]{10}$/;

    if (formData.phone.personal && formData.phone.personal.trim() && !phoneRegex.test(formData.phone.personal)) {
      setError('Invalid personal phone number.');
      return;
    }

    if (formData.phone.work && formData.phone.work.trim() && !phoneRegex.test(formData.phone.work)) {
      setError('Invalid work phone number. ');
      return;
    }

    if (formData.name && (formData.phone.personal || formData.phone.work)) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          setLoading(false);
          return;
        }
        const response = await axios.post(`${apiUrl}contacts/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.message === 'Contact with this name already exists') {
          setError('Contact with this name already exists');
        } else if (response.data.message === 'Contact with this phone number already exists') {
          setError('Contact with this phone number already exists');
        } else if (response.data.message === 'Contact saved successfully') {
          setSuccessMessage('Contact added successfully!');
          setFormData({
            name: '',
            email: { personal: '', work: '' },
            phone: { personal: '', work: '' },
            address: '',
            dob: '',
          });
        } else {
          setError('Failed to add contact.');
          console.log('Contact addition failed:', response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else if (error.response && error.response.status === 409) {
          setError(error.response.data.message);
        } else {
          setError('An unexpected error occurred.');
          console.error('Error adding contact:', error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Name or at least one phone number are required.');
    }
  };

  return (
    <div className="p-4 overflow-auto h-screen bg-gradient-to-r from-violet-200 to-violet-400">
      <div ref={topRef} />
      <NavLink to={'/contacts'} className="flex items-center space-x-2 mb-6 hover:text-blue-800">
        <FaArrowLeft size={20} />
        <span>Back to Contacts</span>
      </NavLink>

      {(error || successMessage) && (
        <div className={`mb-4 p-3 rounded-xl ${error ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'} flex justify-between items-center`}>
          <span>{error || successMessage}</span>
          <button onClick={() => { setError(null); setSuccessMessage(null); }} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
      )}

      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Contact</h2>
        <form onSubmit={submit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={change}
              className="mt-1 p-3 w-full border border-orange-400 rounded-xl outline-none focus:ring-orange-700 focus:border-orange-700 transition-shadow duration-200 focus:shadow-md"
              placeholder="Enter name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Personal Phone:</label>
            <input
              type="tel"
              name="phone.personal"
              value={formData.phone.personal}
              onChange={change}
              className="mt-1 p-3 w-full border border-orange-400 rounded-xl outline-none focus:ring-orange-700 focus:border-orange-700 transition-shadow duration-200 focus:shadow-md"
              placeholder="Enter personal phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Work Phone:</label>
            <input
              type="tel"
              name="phone.work"
              value={formData.phone.work}
              onChange={change}
              className="mt-1 p-3 w-full border border-orange-400 rounded-xl outline-none focus:ring-orange-700 focus:border-orange-700 transition-shadow duration-200 focus:shadow-md"
              placeholder="Enter work phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Personal Email:</label>
            <input
              type="email"
              name="email.personal"
              value={formData.email.personal}
              onChange={change}
              className="mt-1 p-3 w-full border border-orange-400 rounded-xl outline-none focus:ring-orange-700 focus:border-orange-700 transition-shadow duration-200 focus:shadow-md"
              placeholder="Enter personal email address"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Work Email:</label>
            <input
              type="email"
              name="email.work"
              value={formData.email.work}
              onChange={change}
              className="mt-1 p-3 w-full border border-orange-400 rounded-xl outline-none focus:ring-orange-700 focus:border-orange-700 transition-shadow duration-200 focus:shadow-md"
              placeholder="Enter work email address"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={change}
              className="mt-1 p-3 w-full border border-orange-400 rounded-xl outline-none focus:ring-orange-700 focus:border-orange-700 transition-shadow duration-200 focus:shadow-md"
              placeholder="Enter address"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth:
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={change}
              className="mt-1 p-3 w-full border border-orange-400 rounded-xl outline-none focus:ring-orange-700 focus:border-orange-700 transition-shadow duration-200 focus:shadow-md"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-xl text-white font-semibold ${
              loading || isPhoneEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={loading || isPhoneEmpty} // Disable if loading or phone is empty
          >
            {loading ? 'Adding...' : 'Add Contact'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddContact;