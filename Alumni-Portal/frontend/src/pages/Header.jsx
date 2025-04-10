import React, { useState } from 'react';
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
} from '@mui/icons-material';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
            <a href="/" className="text-2xl font-bold text-indigo-600">AlumniConnect</a>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { icon: <JobIcon />, text: "Jobs", href: "/jobs" },
              { icon: <EventIcon />, text: "Events", href: "/events" },
              { icon: <NewsIcon />, text: "News", href: "/news" },
              { icon: <ForumIcon />, text: "Forum", href: "/forum" }
            ].map((item) => (
              <motion.a
                key={item.text}
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 flex items-center gap-2"
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
              <BellIcon />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
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
  );
};

export default Header;