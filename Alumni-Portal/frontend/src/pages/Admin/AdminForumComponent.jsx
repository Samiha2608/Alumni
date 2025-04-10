import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    ExpandMore as ExpandMoreIcon,
    Message as MessageIcon,
    Category as CategoryIcon
} from '@mui/icons-material';

const AdminForumManagement = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        author: '',
        category: '',
        replies: 0,
        status: 'Active'
    });
    const [selectedPost, setSelectedPost] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedPost, setExpandedPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        'General Discussion',
        'Career Advice',
        'Technical Support',
        'Industry News',
        'Networking',
        'Events',
        'Other'
    ];

    const statusOptions = [
        'Active',
        'Closed',
        'Archived',
        'Pinned'
    ];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/forum');
            setPosts(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching forum posts:', error);
            setError('Failed to load forum posts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPost = async () => {
        try {
            await axios.post('http://localhost:5000/api/forum', newPost);
            fetchPosts();
            setNewPost({
                title: '',
                author: '',
                category: '',
                replies: 0,
                status: 'Active'
            });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding forum post:', error);
        }
    };

    const handleEditPost = async () => {
        try {
            await axios.put(`http://localhost:5000/api/forum/${selectedPost.id}`, selectedPost);
            fetchPosts();
            setSelectedPost(null);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating forum post:', error);
        }
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this forum post?')) {
            try {
                await axios.delete(`http://localhost:5000/api/forum/${id}`);
                fetchPosts();
            } catch (error) {
                console.error('Error deleting forum post:', error);
            }
        }
    };

    const toggleExpandPost = (id) => {
        setExpandedPost(expandedPost === id ? null : id);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Closed':
                return 'bg-red-100 text-red-800';
            case 'Archived':
                return 'bg-gray-100 text-gray-800';
            case 'Pinned':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Forum Management</h1>
                    <motion.button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AddIcon className="mr-2" /> Add Forum Post
                    </motion.button>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Replies</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <React.Fragment key={post.id}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                                    <div className="text-sm text-gray-500 md:hidden">{post.author}</div>
                                                    <button 
                                                        onClick={() => toggleExpandPost(post.id)} 
                                                        className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center md:hidden mt-2"
                                                    >
                                                        {expandedPost === post.id ? 'Hide details' : 'Show details'}
                                                        <ExpandMoreIcon className={`ml-1 transform ${expandedPost === post.id ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-3 hidden md:table-cell">
                                                <div className="text-sm text-gray-900">{post.author}</div>
                                            </td>
                                            <td className="p-3 hidden md:table-cell">
                                                <div className="text-sm text-gray-900 flex items-center">
                                                    <CategoryIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                    {post.category}
                                                </div>
                                            </td>
                                            <td className="p-3 hidden lg:table-cell">
                                                <div className="text-sm text-gray-900 flex items-center">
                                                    <MessageIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                    {post.replies}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(post.status)}`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex space-x-2">
                                                    <motion.button 
                                                        onClick={() => { setSelectedPost(post); setIsEditModalOpen(true); }}
                                                        className="text-green-600 hover:text-green-800"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        aria-label="Edit post"
                                                    >
                                                        <EditIcon />
                                                    </motion.button>
                                                    <motion.button 
                                                        onClick={() => handleDeletePost(post.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        aria-label="Delete post"
                                                    >
                                                        <DeleteIcon />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedPost === post.id && (
                                            <tr className="md:hidden bg-gray-50">
                                                <td colSpan="6" className="p-3">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <span className="text-xs font-semibold">Category:</span>
                                                            <div className="text-sm flex items-center">
                                                                <CategoryIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                                {post.category}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-semibold">Replies:</span>
                                                            <div className="text-sm flex items-center">
                                                                <MessageIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                                {post.replies}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        
                        {posts.length === 0 && !isLoading && (
                            <div className="text-center py-8">
                                <MessageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No forum posts</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new forum post.</p>
                                <div className="mt-6">
                                    <motion.button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <AddIcon className="-ml-1 mr-2 h-5 w-5" />
                                        New Post
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Post Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Forum Post</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newPost.title} 
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
                                    required
                                    placeholder="Enter post title"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Author *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newPost.author} 
                                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} 
                                    required
                                    placeholder="Enter author name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category *</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newPost.category} 
                                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Initial Replies</label>
                                <input 
                                    type="number" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newPost.replies} 
                                    onChange={(e) => setNewPost({ ...newPost, replies: parseInt(e.target.value) || 0 })} 
                                    min="0"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newPost.status} 
                                    onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                                >
                                    {statusOptions.map((status, index) => (
                                        <option key={index} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-3">
                            <motion.button 
                                onClick={() => setIsAddModalOpen(false)} 
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                onClick={handleAddPost} 
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!newPost.title || !newPost.author || !newPost.category}
                            >
                                Add Post
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {isEditModalOpen && selectedPost && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Forum Post</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedPost.title} 
                                    onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Author</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                                    value={selectedPost.author} 
                                    readOnly
                                />
                                <p className="mt-1 text-xs text-gray-500">Author cannot be changed</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category *</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedPost.category} 
                                    onChange={(e) => setSelectedPost({ ...selectedPost, category: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Replies</label>
                                <input 
                                    type="number" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                                    value={selectedPost.replies} 
                                    readOnly
                                />
                                <p className="mt-1 text-xs text-gray-500">Reply count is automatically updated</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedPost.status} 
                                    onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value })}
                                >
                                    {statusOptions.map((status, index) => (
                                        <option key={index} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-3">
                            <motion.button 
                                onClick={() => setIsEditModalOpen(false)} 
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                onClick={handleEditPost} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!selectedPost.title || !selectedPost.category}
                            >
                                Save Changes
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminForumManagement;