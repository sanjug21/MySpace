import React, { useState } from 'react';
import axios from 'axios';
import { FaImage, FaUpload, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AddPost() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:7125/";

  const updateFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const updateCaption = (e) => {
    setCaption(e.target.value);
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const submitPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${apiUrl}posts/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('Post added successfully!');
      setFile(null);
      setPreviewUrl(null);
      setCaption('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to add post.');
      } else {
        setError('Network error or server unavailable.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center ">
      <div className="w-2/3 max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 relative">
        <div className="absolute top-1 left-2">
          <button onClick={handleBack} className=" hover:text-gray-800">
            <FaArrowLeft className="inline-block mr-1" /> Back
          </button>
        </div>
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Create a Post</h2>
        </div>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
        <form onSubmit={submitPost} className="space-y-6">
          <div>
            <textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={updateCaption}
              className="w-full p-4 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-700 resize-none"
              rows="2"
            />
          </div>
          <div className="mb-4 relative">
            {previewUrl ? (
              <div>
                <div className="flex justify-center">
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-96 rounded-lg shadow-md" />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                >
                  <FaTrash />
                </button>
              </div>
            ) : (
              <div className="border rounded-lg p-4 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center justify-center">
                  <FaImage className="text-4xl text-gray-500 mb-2" />
                  <span className="text-gray-600">Select Image</span>
                </label>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={updateFile}
                  accept="image/*"
                />
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold flex items-center justify-center ${
                loading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transition-colors duration-200'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <FaUpload className="mr-2 animate-spin" />
                  Adding...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaUpload className="mr-2" />
                  Post
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPost;