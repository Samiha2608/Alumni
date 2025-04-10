import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    ExpandMore as ExpandMoreIcon, 
    CloudUpload as CloudUploadIcon 
} from '@mui/icons-material';
import { format } from 'date-fns';

const AdminJobManagement = () => {
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        employment_type: 'Full-time',
        experience_level: 'Entry-level',
        application_deadline: '',
        status: 'Active'
    });
    const [selectedJob, setSelectedJob] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedJob, setExpandedJob] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };
    const handleExcelUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/jobs/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploadSuccess(`Successfully uploaded ${response.data.uploadedCount} jobs`);
            setUploadError(null);
            fetchJobs(); // Refresh the job list
            
            // Clear file input
            event.target.value = null;

            // Clear success message after 3 seconds
            setTimeout(() => {
                setUploadSuccess(null);
            }, 3000);

        } catch (error) {
            setUploadError(error.response?.data?.message || 'Error uploading jobs');
            setUploadSuccess(null);

            // Clear error message after 3 seconds
            setTimeout(() => {
                setUploadError(null);
            }, 3000);
        }
    };

    const handleAddJob = async () => {
        try {
            await axios.post('http://localhost:5000/api/jobs', newJob);
            fetchJobs();
            setNewJob({
                title: '',
                company: '',
                location: '',
                description: '',
                salary: '',
                employment_type: 'Full-time',
                experience_level: 'Entry-level',
                application_deadline: '',
                status: 'Active'
            });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    const handleEditJob = async () => {
        try {
            await axios.put(`http://localhost:5000/api/jobs/${selectedJob.id}`, selectedJob);
            fetchJobs();
            setSelectedJob(null);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await axios.delete(`http://localhost:5000/api/jobs/${id}`);
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    const toggleExpandJob = (id) => {
        setExpandedJob(expandedJob === id ? null : id);
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Job Management</h1>
                <div className="flex space-x-3">
                    <motion.button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AddIcon className="mr-2" /> Add Job Posting
                    </motion.button>
                    
                    <motion.label 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CloudUploadIcon className="mr-2" /> Upload Excel
                        <input 
                            type="file" 
                            accept=".xlsx, .xls" 
                            className="hidden" 
                            onChange={handleExcelUpload}
                        />
                    </motion.label>
                </div>
            </div>

            {/* Error and Success Messages */}
            {uploadError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {uploadError}
                </div>
            )}
            {uploadSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {uploadSuccess}
                </div>
            )}
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Company</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Level</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Deadline</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <React.Fragment key={job.id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 hidden md:flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800">
                                                    {job.title.charAt(0)}
                                                </div>
                                                <div className="ml-0 md:ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                                    <div className="text-sm text-gray-500 md:hidden">{job.company}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleExpandJob(job.id)} 
                                                className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center md:hidden mt-2"
                                            >
                                                {expandedJob === job.id ? 'Hide details' : 'Show details'}
                                                <ExpandMoreIcon className={`ml-1 transform ${expandedJob === job.id ? 'rotate-180' : ''}`} />
                                            </button>
                                        </td>
                                        <td className="p-3 whitespace-nowrap hidden md:table-cell">
                                            <div className="text-sm text-gray-900">{job.company}</div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap hidden md:table-cell">
                                            <div className="text-sm text-gray-900">{job.location}</div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap hidden md:table-cell">
                                            <div className="text-sm text-gray-900">{job.employment_type}</div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap hidden lg:table-cell">
                                            <div className="text-sm text-gray-900">{job.experience_level}</div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap hidden lg:table-cell">
                                            <div className="text-sm text-gray-900">{formatDate(job.application_deadline)}</div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <motion.button 
                                                    onClick={() => { setSelectedJob(job); setIsEditModalOpen(true); }}
                                                    className="text-green-600 hover:text-green-800"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <EditIcon />
                                                </motion.button>
                                                <motion.button 
                                                    onClick={() => handleDeleteJob(job.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <DeleteIcon />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedJob === job.id && (
                                        <tr className="md:hidden bg-gray-50">
                                            <td colSpan="8" className="p-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-xs font-semibold">Location:</span>
                                                        <div className="text-sm">{job.location}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold">Type:</span>
                                                        <div className="text-sm">{job.employment_type}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold">Level:</span>
                                                        <div className="text-sm">{job.experience_level}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold">Deadline:</span>
                                                        <div className="text-sm">{formatDate(job.application_deadline)}</div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-xs font-semibold">Salary:</span>
                                                        <div className="text-sm">{job.salary ? `$${job.salary}` : 'Not specified'}</div>
                                                    </div>
                                                    {job.description && (
                                                        <div className="col-span-2">
                                                            <span className="text-xs font-semibold">Description:</span>
                                                            <div className="text-sm">{job.description.length > 100 ? 
                                                                `${job.description.substring(0, 100)}...` : job.description}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {jobs.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-gray-500">No job postings found. Click "Add Job Posting" to create one.</p>
                    </div>
                )}
            </div>

            {/* Add Job Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Job</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.title} 
                                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.company} 
                                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.location} 
                                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Employment Type *</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.employment_type} 
                                    onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value })}
                                    required
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience Level *</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.experience_level} 
                                    onChange={(e) => setNewJob({ ...newJob, experience_level: e.target.value })}
                                    required
                                >
                                    <option value="Entry-level">Entry-level</option>
                                    <option value="Mid-level">Mid-level</option>
                                    <option value="Senior">Senior</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Salary</label>
                                <input 
                                    type="number" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.salary} 
                                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} 
                                    placeholder="Annual salary"
                                    step="0.01"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                                <input 
                                    type="date" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.application_deadline} 
                                    onChange={(e) => setNewJob({ ...newJob, application_deadline: e.target.value })} 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newJob.status} 
                                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24"
                                    value={newJob.description || ''} 
                                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} 
                                    placeholder="Job description..."
                                ></textarea>
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
                                onClick={handleAddJob} 
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Add Job
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Job Modal */}
            {isEditModalOpen && selectedJob && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Job</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.title} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.company} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location *</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.location} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Employment Type *</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.employment_type} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, employment_type: e.target.value })}
                                    required
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience Level *</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.experience_level} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, experience_level: e.target.value })}
                                    required
                                >
                                    <option value="Entry-level">Entry-level</option>
                                    <option value="Mid-level">Mid-level</option>
                                    <option value="Senior">Senior</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Salary</label>
                                <input 
                                    type="number" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.salary || ''} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, salary: e.target.value })} 
                                    placeholder="Annual salary"
                                    step="0.01"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                                <input 
                                    type="date" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.application_deadline || ''} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, application_deadline: e.target.value })} 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedJob.status} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24"
                                    value={selectedJob.description || ''} 
                                    onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })} 
                                    placeholder="Job description..."
                                ></textarea>
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
                                onClick={handleEditJob} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
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

export default AdminJobManagement;