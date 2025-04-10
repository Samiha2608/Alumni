import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Work as JobsIcon,
  Event as EventsIcon,
  Article as NewsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    alumni: 0,
    jobs: 0,
    events: 0,
    news: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch alumni data
      const alumniResponse = await axios.get('http://localhost:5000/api/alumni');
      
      // Fetch jobs data
      const jobsResponse = await axios.get('http://localhost:5000/api/jobs');
      
      // Fetch events data
      const eventsResponse = await axios.get('http://localhost:5000/api/events');
      
      // Fetch forum posts data
      const forumResponse = await axios.get('http://localhost:5000/api/forum');
      
      // Set stats with actual counts
      setStats({
        alumni: alumniResponse.data.length || 0,
        jobs: jobsResponse.data.length || 0,
        events: eventsResponse.data.length || 0,
        news: forumResponse.data.length || 0
      });
      
      // Create recent activities array with only the most recent item from each category
      const activities = [];
      
      // Get most recent alumni (if exists)
      if (alumniResponse.data.length > 0) {
        // Sort by creation date (descending)
        const sortedAlumni = [...alumniResponse.data].sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        const latestAlumni = sortedAlumni[0];
        activities.push({
          id: `alumni-${latestAlumni.id}`,
          type: "User",
          description: `New alumni registered: ${latestAlumni.name}`,
          time: formatTimeAgo(latestAlumni.created_at || new Date())
        });
      }
      
      // Get most recent job (if exists)
      if (jobsResponse.data.length > 0) {
        const sortedJobs = [...jobsResponse.data].sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        const latestJob = sortedJobs[0];
        activities.push({
          id: `job-${latestJob.id}`,
          type: "Job",
          description: `New job posting: ${latestJob.title} at ${latestJob.company}`,
          time: formatTimeAgo(latestJob.created_at || new Date())
        });
      }
      
      // Get most recent event (if exists)
      if (eventsResponse.data.length > 0) {
        const sortedEvents = [...eventsResponse.data].sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        const latestEvent = sortedEvents[0];
        activities.push({
          id: `event-${latestEvent.id}`,
          type: "Event",
          description: `${latestEvent.title} (${latestEvent.status})`,
          time: formatTimeAgo(latestEvent.created_at || new Date())
        });
      }
      
      // Get most recent forum post (if exists)
      if (forumResponse.data.length > 0) {
        const sortedPosts = [...forumResponse.data].sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        const latestPost = sortedPosts[0];
        activities.push({
          id: `post-${latestPost.id}`,
          type: "News",
          description: `New forum post: ${latestPost.title}`,
          time: formatTimeAgo(latestPost.created_at || new Date())
        });
      }
      
      setRecentActivities(activities);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to format timestamps as "X time ago"
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown time";
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffSecs < 60) return `${diffSecs} secs ago`;
      if (diffMins < 60) return `${diffMins} mins ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;
      
      // Format as date if older than a week
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    
    // Optional: Set up polling to refresh data every few minutes
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000); // every 5 minutes
    
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  // Create the stats cards array with actual data
  const statsCards = [
    { icon: <UsersIcon />, title: "Total Alumni", value: loading ? "Loading..." : stats.alumni.toLocaleString() },
    { icon: <JobsIcon />, title: "Job Postings", value: loading ? "Loading..." : stats.jobs.toLocaleString() },
    { icon: <EventsIcon />, title: "Upcoming Events", value: loading ? "Loading..." : stats.events.toLocaleString() },
    { icon: <NewsIcon />, title: "News Articles", value: loading ? "Loading..." : stats.news.toLocaleString() }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen && <span className="text-xl font-bold text-indigo-600">Admin Panel</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        <nav className="mt-5">
          {[
            { icon: <DashboardIcon />, text: "Dashboard", href: "/adminDashboard" },
            { icon: <UsersIcon />, text: "Alumni", href: "/alumniManagement" },
            { icon: <JobsIcon />, text: "Jobs", href: "/jobManagement" },
            { icon: <EventsIcon />, text: "Events", href: "/eventManagement" },
            { icon: <NewsIcon />, text: "News", href: "/forumManagement" },
            { icon: <SettingsIcon />, text: "Settings", href: "/admin/settings" }
          ].map((item) => (
            <a
              key={item.text}
              href={item.href}
              className="flex items-center p-4 hover:bg-gray-50 text-gray-700 hover:text-indigo-600"
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3">{item.text}</span>}
            </a>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t">
          <a
            href="/logout"
            className="flex items-center p-4 hover:bg-gray-50 text-red-600 hover:text-red-700"
          >
            <LogoutIcon />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchDashboardData} 
              className="p-2 rounded-full hover:bg-gray-100 text-indigo-600"
              title="Refresh data"
              disabled={loading}
            >
              <RefreshIcon className={loading ? "animate-spin" : ""} />
            </button>
            <span className="text-gray-600">Welcome, Admin</span>
          </div>
        </header>

        {/* Error Message (if any) */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className="text-indigo-600">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-50 p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center"
                >
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                      activity.type === "User" ? "bg-blue-100 text-blue-800" : 
                      activity.type === "Job" ? "bg-green-100 text-green-800" :
                      activity.type === "Event" ? "bg-purple-100 text-purple-800" :
                      "bg-indigo-100 text-indigo-800"
                    }`}>
                      {activity.type}
                    </span>
                    <span className="text-gray-700">{activity.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              No recent activities found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;