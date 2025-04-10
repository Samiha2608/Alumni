import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/alumni";

const AdminAlumniManagement = () => {
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlumniId, setCurrentAlumniId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    graduationYear: "",
    degree: "",
    email: "",
    jobStatus: "Employed", // Default value from the ENUM
    company: "",
    jobLevel: "Junior", // Default value from the ENUM
    phoneNo: "",
  });

  // Fetch alumni from backend
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setAlumni(response.data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      graduationYear: "",
      degree: "",
      email: "",
      jobStatus: "Employed", // Default value from the ENUM
      company: "",
      jobLevel: "Junior", // Default value from the ENUM
      phoneNo: "",
    });
    setIsEditing(false);
    setCurrentAlumniId(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        // Update existing alumni
        await axios.put(`${API_URL}/${currentAlumniId}`, formData);
        setAlumni(
          alumni.map((item) =>
            item.id === currentAlumniId ? { id: currentAlumniId, ...formData } : item
          )
        );
      } else {
        // Add new alumni
        const response = await axios.post(`${API_URL}`, formData);
        setAlumni([...alumni, { id: response.data.alumniId, ...formData }]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving alumni:", error);
      alert(`Error: ${error.response?.data?.message || "An error occurred while saving"}`);
    }
  };

  // Handle edit alumni
  const handleEditAlumni = (alumnus) => {
    setIsEditing(true);
    setCurrentAlumniId(alumnus.id);
    setFormData({
      name: alumnus.name,
      graduationYear: alumnus.graduationYear,
      degree: alumnus.degree,
      email: alumnus.email,
      jobStatus: alumnus.jobStatus,
      company: alumnus.company || "",
      jobLevel: alumnus.jobLevel || "Junior", // Default to Junior if not set
      phoneNo: alumnus.phoneNo || "",
    });
    setShowForm(true);
  };

  // Handle delete alumni
  const handleDeleteAlumni = async (id) => {
    if (window.confirm("Are you sure you want to delete this alumni record?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setAlumni(alumni.filter((a) => a.id !== id));
      } catch (error) {
        console.error("Error deleting alumni:", error);
        alert("Failed to delete alumni record");
      }
    }
  };

  // Handle Excel file upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setUploadingExcel(true);
    
    try {
      await axios.post('http://localhost:5000/api/alumni/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Refresh alumni list after successful upload
      fetchAlumni();
      alert('Excel file uploaded successfully');
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      alert(`Error: ${error.response?.data?.message || "An error occurred while uploading"}`);
    } finally {
      setUploadingExcel(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Get job level badge color
  const getJobLevelColor = (level) => {
    switch (level) {
      case "Junior":
        return "bg-green-100 text-green-800";
      case "Mid":
        return "bg-blue-100 text-blue-800";
      case "Senior":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Hidden file input reference
  const fileInputRef = React.useRef(null);

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg">
        {/* Header with responsive layout */}
        <div className="p-4 md:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Alumni Management</h1>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-md hover:bg-indigo-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AddIcon className="mr-1 sm:mr-2" fontSize="small" /> Add Alumni
            </motion.button>
            
            {/* Excel Upload Button */}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".xlsx,.xls" 
              onChange={handleExcelUpload}
            />
            <motion.button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-md hover:bg-green-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={uploadingExcel}
            >
              <CloudUploadIcon className="mr-1 sm:mr-2" fontSize="small" /> 
              {uploadingExcel ? "Uploading..." : "Upload Excel"}
            </motion.button>
            
            <button 
              className="md:hidden bg-gray-200 p-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Search Bar - Always visible */}
        <div className="p-4 md:p-6 border-b">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Mobile card view for small screens */}
        <div className="md:hidden">
          {alumni
            .filter((alumnus) =>
              alumnus.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((alumnus) => (
              <div key={alumnus.id} className="p-4 border-b">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{alumnus.name}</h3>
                    <p className="text-sm text-gray-500">{alumnus.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditAlumni(alumnus)}
                    >
                      <EditIcon fontSize="small" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteAlumni(alumnus.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Year:</span> {alumnus.graduationYear}
                  </div>
                  <div>
                    <span className="text-gray-500">Degree:</span> {alumnus.degree}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span> {alumnus.phoneNo}
                  </div>
                  <div>
                    <span className="text-gray-500">Company:</span> {alumnus.company || "-"}
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      alumnus.jobStatus === "Employed" ? "bg-green-100 text-green-800" :
                      alumnus.jobStatus === "Unemployed" ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {alumnus.jobStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Level:</span>{" "}
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getJobLevelColor(alumnus.jobLevel)}`}>
                      {alumnus.jobLevel || "-"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Graduation Year</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Degree</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Job Status</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Job Level</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alumni
                .filter((alumnus) =>
                  alumnus.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((alumnus) => (
                  <tr key={alumnus.id} className="hover:bg-gray-50 border-b">
                    <td className="p-4">{alumnus.name}</td>
                    <td className="p-4">{alumnus.graduationYear}</td>
                    <td className="p-4">{alumnus.degree}</td>
                    <td className="p-4">{alumnus.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alumnus.jobStatus === "Employed" ? "bg-green-100 text-green-800" :
                        alumnus.jobStatus === "Unemployed" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {alumnus.jobStatus}
                      </span>
                    </td>
                    <td className="p-4">{alumnus.company}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getJobLevelColor(alumnus.jobLevel)}`}>
                        {alumnus.jobLevel || "-"}
                      </span>
                    </td>
                    <td className="p-4">{alumnus.phoneNo}</td>
                    <td className="p-4 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditAlumni(alumnus)}
                      >
                        <EditIcon />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteAlumni(alumnus.id)}
                      >
                        <DeleteIcon />
                      </motion.button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* No results message */}
        {alumni.filter(alumnus => 
          alumnus.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No alumni records found matching your search.
          </div>
        )}
      </div>

      {/* Pop-up Form for Adding/Editing Alumni - Responsive */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Alumni" : "Add New Alumni"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Graduation Year <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="graduationYear"
                  placeholder="Graduation Year"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Degree <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Job Status <span className="text-red-500">*</span></label>
                <select
                  name="jobStatus"
                  value={formData.jobStatus}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                >
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Job Level <span className="text-red-500">*</span></label>
                <select
                  name="jobLevel"
                  value={formData.jobLevel}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="phoneNo"
                  placeholder="Phone Number"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <motion.button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!formData.name || !formData.graduationYear || !formData.degree || !formData.email || !formData.phoneNo}
              >
                {isEditing ? "Update" : "Save"}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlumniManagement;