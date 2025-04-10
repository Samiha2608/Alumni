import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  NotificationsNone as BellIcon,
  Work as JobIcon,
  Event as EventIcon,
  Article as NewsIcon,
  Forum as ForumIcon,
  ArrowForward as ArrowIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as CompanyIcon,
  Apartment as BuildingIcon,
  Info as InfoIcon,
  NewReleases as NewIcon
} from '@mui/icons-material';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch events data
    fetch('http://localhost:5000/api/events')
      .then(response => response.json())
      .then(data => {
        // Sort by created_at in descending order to get latest events
        const sortedEvents = (data.events || data).sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setEvents(sortedEvents);
      })
      .catch(error => console.error('Error fetching events:', error));

    // Fetch jobs data
    fetch('http://localhost:5000/api/jobs')
      .then(response => response.json())
      .then(data => {
        // Sort by posted_date in descending order to get latest jobs
        const sortedJobs = data.sort((a, b) => 
          new Date(b.posted_date) - new Date(a.posted_date)
        );
        setJobs(sortedJobs);
      })
      .catch(error => console.error('Error fetching jobs:', error))
      .finally(() => setLoading(false));
  }, []);

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

  // Function to format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav 
        className="bg-white shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl font-bold text-indigo-600">AlumniConnect</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { icon: <JobIcon fontSize="medium" />, text: "Jobs", href: "/jobs" },
                { icon: <EventIcon fontSize="medium" />, text: "Events", href: "/events" },
                { icon: <NewsIcon fontSize="medium" />, text: "News", href: "/news" },
                { icon: <ForumIcon fontSize="medium" />, text: "Forum", href: "/forum" }
              ].map((item) => (
                <motion.a
                  key={item.text}
                  href={item.href}
                  className="text-gray-700 hover:text-indigo-600 flex items-center gap-2 text-base"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  {item.text}
                </motion.a>
              ))}
              <motion.button 
                className="p-2 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BellIcon fontSize="medium" />
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <CloseIcon fontSize="medium" /> : <MenuIcon fontSize="medium" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="pt-2 pb-3 space-y-1">
            {[
              { text: "Jobs", href: "/jobs" },
              { text: "Events", href: "/events" },
              { text: "News", href: "/news" },
              { text: "Forum", href: "/forum" }
            ].map((item) => (
              <motion.a
                key={item.text}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.text}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        className="bg-indigo-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl"
              variants={itemVariants}
            >
              Welcome to AlumniConnect
            </motion.h1>
            <motion.p 
              className="mt-6 max-w-md mx-auto text-lg text-indigo-100 sm:text-xl md:mt-8 md:text-2xl md:max-w-3xl"
              variants={itemVariants}
            >
              Connect with fellow alumni, discover opportunities, and stay updated with university news.
            </motion.p>
            <motion.div 
              className="mt-10 flex justify-center"
              variants={itemVariants}
            >
              <div className="max-w-xl w-full">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" style={{ fontSize: '1.25rem' }} />
                  <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 border border-transparent rounded-lg leading-5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-base"
                    placeholder="Search events, jobs, or news..."
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Events Section with "NEW" badge */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            className="text-3xl font-bold text-gray-900"
            variants={itemVariants}
          >
            Recent Events
          </motion.h2>
          <motion.a
            href="/events"
            className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Events <ArrowIcon className="ml-2" />
          </motion.a>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-base">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-base">No events available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="p-6 relative">
                  {index === 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <NewIcon fontSize="small" className="mr-1" /> NEW
                    </div>
                  )}
                  <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <EventIcon style={{ fontSize: '2.5rem' }} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{event.title}</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="text-indigo-500" style={{ fontSize: '1.25rem' }} />
                      <p className="text-gray-600 text-base">{formatDate(event.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon className="text-indigo-500" style={{ fontSize: '1.25rem' }} />
                      <p className="text-gray-600 text-base">{event.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <InfoIcon className="text-indigo-500" style={{ fontSize: '1.25rem' }} />
                      <p className="text-gray-600 text-base">{event.type}</p>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'Upcoming' ? 'bg-green-100 text-green-800' :
                        event.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <motion.a 
                    href={`/events/${event.id}`}
                    className="mt-4 text-base text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 justify-center"
                    whileHover={{ x: 5 }}
                  >
                    View Event Details <ArrowIcon />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Latest Job Opportunities with highlighting - REMOVED BLUE BORDER */}
      <div className="bg-indigo-50 py-12">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900"
              variants={itemVariants}
            >
              Latest Job Opportunities
            </motion.h2>
            <motion.a
              href="/jobs"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Jobs <ArrowIcon className="ml-2" />
            </motion.a>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-base">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-base">No jobs available</div>
          ) : (
            <div className="space-y-5">
              {jobs.slice(0, 3).map((job, index) => (
                <motion.div
                  key={job.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                  whileHover={{ x: 10, scale: 1.01 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                          <JobIcon style={{ fontSize: '2rem' }} className="text-indigo-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                            {index === 0 && (
                              <span className="ml-3 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                <NewIcon fontSize="small" className="mr-1" /> NEWEST
                              </span>
                            )}
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <CompanyIcon className="text-indigo-500" style={{ fontSize: '1.25rem' }} />
                              <span className="text-gray-600 text-base">{job.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <LocationIcon className="text-indigo-500" style={{ fontSize: '1.25rem' }} />
                              <span className="text-gray-600 text-base">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="text-indigo-500" style={{ fontSize: '1.25rem' }} />
                              <span className="text-gray-600 text-base">{job.employment_type}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {job.status}
                              </span>
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {job.experience_level}
                              </span>
                              {job.application_deadline && (
                                <span className="text-xs text-gray-500">
                                  Deadline: {formatDate(job.application_deadline)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:ml-6 flex md:flex-col items-center gap-3">
                      {job.salary && (
                        <div className="bg-green-50 px-3 py-2 rounded-lg text-center">
                          <span className="block text-xs text-green-800 font-medium">Salary</span>
                          <span className="text-base font-bold text-green-700">${job.salary.toLocaleString()}</span>
                        </div>
                      )}
                      <motion.a
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats Section to fill up space */}
      <motion.div 
        className="bg-white py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl font-bold text-gray-900 mb-10 text-center"
            variants={itemVariants}
          >
            Alumni Network at a Glance
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { count: '10,000+', label: 'Alumni Members', icon: <CompanyIcon style={{ fontSize: '2.5rem' }} /> },
              { count: '500+', label: 'Job Opportunities', icon: <JobIcon style={{ fontSize: '2.5rem' }} /> },
              { count: '250+', label: 'Annual Events', icon: <EventIcon style={{ fontSize: '2.5rem' }} /> },
              { count: '100+', label: 'Discussion Forums', icon: <ForumIcon style={{ fontSize: '2.5rem' }} /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-indigo-50 rounded-xl p-6 text-center"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-3 text-indigo-600">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-indigo-700 mb-2">{stat.count}</p>
                <p className="text-base text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;