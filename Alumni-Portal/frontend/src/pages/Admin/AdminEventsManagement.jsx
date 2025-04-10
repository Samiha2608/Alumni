import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const AdminEventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    date: '', 
    location: '', 
    type: '', 
    status: 'Upcoming' 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleAddOrUpdateEvent = async () => {
    try {
      if (currentEvent) {
        await axios.put(`http://localhost:5000/api/events/${currentEvent.id}`, newEvent);
        setEvents(events.map(event => 
          event.id === currentEvent.id ? { ...event, ...newEvent } : event
        ));
      } else {
        const response = await axios.post("http://localhost:5000/api/events", newEvent);
        setEvents([...events, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setNewEvent(event);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewEvent({ 
      title: '', 
      date: '', 
      location: '', 
      type: '', 
      status: 'Upcoming' 
    });
    setCurrentEvent(null);
    setIsModalOpen(false);
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Reset previous messages
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/upload-excel", 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Refresh events list after successful upload
      fetchEvents();
      
      // Set success message
      setUploadSuccess(`Successfully uploaded ${response.data.insertedEvents} events`);
    } catch (error) {
      console.error("Excel upload error:", error);
      
      // Set error message
      setUploadError(
        error.response?.data?.message || 
        'Error uploading Excel file'
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg">
        {/* Error/Success Message */}
        {uploadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {uploadError}
          </div>
        )}
        {uploadSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            {uploadSuccess}
          </div>
        )}

        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <div className="flex space-x-4">
            {/* Excel Upload Button */}
            <input 
              type="file" 
              id="excel-upload" 
              accept=".xlsx,.xls" 
              onChange={handleExcelUpload} 
              style={{ display: 'none' }}
            />
            <motion.label 
              htmlFor="excel-upload"
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CloudUploadIcon className="mr-2" /> Upload Excel
            </motion.label>

            {/* Create Event Button */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AddIcon className="mr-2" /> Create Event
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 border-b">
                  <td className="p-4">{event.title}</td>
                  <td className="p-4">{event.date}</td>
                  <td className="p-4">{event.location}</td>
                  <td className="p-4">{event.type}</td>
                  <td className="p-4">{event.status}</td>
                  <td className="p-4 flex space-x-2">
                    <motion.button 
                      onClick={() => openEditModal(event)} 
                      className="text-green-600 hover:text-green-800"
                    >
                      <EditIcon />
                    </motion.button>
                    <motion.button 
                      onClick={() => handleDeleteEvent(event.id)} 
                      className="text-red-600 hover:text-red-800"
                    >
                      <DeleteIcon />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding/Editing Event */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {currentEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <motion.button 
                  onClick={resetForm} 
                  whileHover={{ scale: 1.1 }}
                >
                  <CloseIcon className="text-gray-500 hover:text-gray-700" />
                </motion.button>
              </div>
              <div className="mt-4 space-y-4">
                <input 
                  type="text" 
                  placeholder="Event Title" 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                />
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={newEvent.date} 
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={newEvent.location} 
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Type" 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={newEvent.type} 
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} 
                />
                <select 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={newEvent.status} 
                  onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end">
                <motion.button 
                  onClick={handleAddOrUpdateEvent} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700" 
                  whileHover={{ scale: 1.05 }}
                >
                  Save Event
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsManagement;