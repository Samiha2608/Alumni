import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Person as ProfileIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  School as EducationIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    graduationYear: 2015,
    major: "Computer Science",
    currentRole: "Senior Software Engineer",
    company: "TechCorp Innovations",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Header */}
          <div className="bg-indigo-600 p-6">
            <motion.div 
              className="flex justify-between items-center"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <ProfileIcon className="text-white text-4xl mr-4" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {profile.name}
                  </h1>
                  <p className="text-indigo-100">
                    Class of {profile.graduationYear}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleEdit}
                className="text-white hover:bg-indigo-700 p-2 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <EditIcon />
              </motion.button>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              {/* Professional Info */}
              <motion.div 
                className="bg-gray-50 p-4 rounded-lg"
                variants={itemVariants}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <WorkIcon className="mr-2 text-indigo-600" />
                  Professional Details
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <strong className="mr-2">Role:</strong>
                    {profile.currentRole}
                  </div>
                  <div className="flex items-center">
                    <strong className="mr-2">Company:</strong>
                    {profile.company}
                  </div>
                  <div className="flex items-center">
                    <LocationIcon className="mr-2 text-gray-500" />
                    {profile.location}
                  </div>
                </div>
              </motion.div>

              {/* Academic Info */}
              <motion.div 
                className="bg-gray-50 p-4 rounded-lg"
                variants={itemVariants}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <EducationIcon className="mr-2 text-indigo-600" />
                  Academic Background
                </h2>
                <div className="space-y-2">
                  <div>
                    <strong>Major:</strong> {profile.major}
                  </div>
                  <div>
                    <strong>Graduation:</strong> Class of {profile.graduationYear}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact & Social */}
            <motion.div 
              className="mt-6 bg-gray-50 p-4 rounded-lg"
              variants={itemVariants}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <EmailIcon className="mr-2 text-indigo-600" />
                Contact Information
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <EmailIcon className="mr-2 text-gray-500" />
                  {profile.email}
                </div>
                <motion.a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-indigo-600"
                  whileHover={{ scale: 1.1 }}
                >
                  <LinkedInIcon className="mr-2" />
                  LinkedIn
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;