import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Spinner from "../components/Spinner";
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHeart, FaComment } from 'react-icons/fa';

function UserPosts() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
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

                const response = await axios.get(`http://localhost:7125/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.userId !== userId) {
                    setError("Unauthorized");
                    setLoading(false);
                    return;
                }

                setPost(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch post.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;

                const response = await axios.get(`http://localhost:7125/posts?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAllPosts(response.data);
            } catch (err) {
                console.error("Failed to fetch all posts: ", err);
            }
        };
        fetchAllPosts();
    }, []);

    const navigateToPost = (id) => {
        navigate(`/post/${id}`);
    };

    const getAdjacentPostIds = () => {
        if (!post || !allPosts) return { prevId: null, nextId: null };

        const currentIndex = allPosts.findIndex((p) => p._id === post._id);
        const prevPost = allPosts[currentIndex - 1];
        const nextPost = allPosts[currentIndex + 1];

        return {
            prevId: prevPost ? prevPost._id : null,
            nextId: nextPost ? nextPost._id : null,
        };
    };

    const { prevId, nextId } = getAdjacentPostIds();

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    if (!post) {
        return <div className="p-4">Post not found.</div>;
    }

    return (
        <div className="h-screen w-full overflow-y-auto bg-gradient-to-r from-purple-200 to-indigo-300 p-4">
            <div className="mb-4">
                <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                    Back
                </button>
            </div>
            <div className="flex justify-between items-center mb-4">
                {prevId && (
                    <button onClick={() => navigateToPost(prevId)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                        <FaChevronLeft /> Previous
                    </button>
                )}
                {nextId && (
                    <button onClick={() => navigateToPost(nextId)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                        Next <FaChevronRight />
                    </button>
                )}
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
                {post.pic && <img src={post.pic} alt="Post" className="w-full object-cover rounded-md mb-4" />}
                <div className="mb-4">
                    <p className="text-gray-700">{post.content}</p>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <div className="flex items-center">
                        <button className="flex items-center mr-4">
                            <FaHeart className="mr-1" /> {post.likes?.length || 0}
                        </button>
                        <button className="flex items-center">
                            <FaComment className="mr-1" /> {post.comments?.length || 0}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPosts;