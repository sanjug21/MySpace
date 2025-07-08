import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Spinner from "../components/Spinner";
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHeart, FaComment, FaArrowLeft } from 'react-icons/fa';

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
        <div className="min-h-screen w-full overflow-y-auto bg-gradient-to-r from-purple-200 to-indigo-300 p-4 relative">
            <div className="mb-4">
                <button onClick={() => navigate('/')} className="hover:text-blue-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center">
                    <FaArrowLeft className="mr-2" />
                </button>
            </div>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevId ? () => navigateToPost(prevId) : null}
                    className={`absolute top-1/2 transform -translate-y-1/2 left-4 bg-black bg-opacity-20 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline ${!prevId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!prevId}
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={nextId ? () => navigateToPost(nextId) : null}
                    className={`absolute top-1/2 transform -translate-y-1/2 right-4 bg-black bg-opacity-20 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline ${!nextId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!nextId}
                >
                    <FaChevronRight />
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <div className="mb-4">
                    <p className="text-gray-700">{post.caption}</p>
                </div>
                {post.pic && (
                    <img
                        src={post.pic}
                        alt="Post"
                        className="rounded-md mb-4 max-h-[500px] mx-auto block"
                        style={{ maxWidth: '100%', objectFit: 'cover' }}
                    />
                )}
                <div className="flex justify-between items-center text-gray-600">
                    <div className="flex items-center">
                        <button className="flex items-center mr-4 text-red-500">
                            <FaHeart className="mr-1" /> {post.likes?.length || 0}
                        </button>
                        <button className="flex items-center text-blue-500">
                            <FaComment className="mr-1" /> {post.comments?.length || 0}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPosts;