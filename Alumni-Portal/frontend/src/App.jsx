import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React from "react"; 
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";
import ForumPage from "./pages/ForumPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAlumniManagement from "./pages/Admin/AdminAlumniManagement";
import AdminJobManagement from "./pages/Admin/AdminJobManagment";
import AdminEventsManagement from "./pages/Admin/AdminEventsManagement";
import AdminForumManagement from "./pages/Admin/AdminForumComponent";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminSignup from "./pages/Admin/AdminSignup";


function App() {
  return (
    <Router>
 <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/alumniManagement" element={<AdminAlumniManagement />} />
          <Route path="/jobManagement" element={<AdminJobManagement />} />
          <Route path="/eventManagement" element={<AdminEventsManagement />} />
          <Route path="/forumManagement" element={<AdminForumManagement />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminSignup" element={<AdminSignup />} />
   
        </Routes>
    </Router>
  );
}
export default App;
