import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { FaComments, FaBell, FaBookmark } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const { isDark, toggleTheme } = useTheme();
  const navigateTo = useNavigate();

  // Fetch notifications
  useEffect(() => {
    if (isAuthorized) {
      fetchNotifications();
    }
  }, [isAuthorized]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/notifications",
        { withCredentials: true }
      );
      setNotifications(data.notifications || []);
      setUnreadCount(data.notifications?.filter(n => !n.read).length || 0);
    } catch (error) {
      // Silently fail - notifications are not critical
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/v1/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete(
        "http://localhost:4000/api/v1/notifications",
        { withCredentials: true }
      );
      setNotifications([]);
      setUnreadCount(0);
      setShowNotifications(false);
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logged out.");
    } finally {
      setUser({});
      setIsAuthorized(false);
      navigateTo("/login");
    }
  };

  const closeMenu = () => setShow(false);

  if (!isAuthorized) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="container-base">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/careerconnect-white.png" 
              alt="CareerConnect Logo" 
              className="h-10 md:h-12 w-auto dark:invert"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              <NavLink to="/" label="Home" />
              <NavLink to="/job/getall" label="Jobs" />
              <NavLink 
                to="/applications/me" 
                label={user?.role === "Employer" ? "Applications" : "My Applications"}
              />
              
              {user?.role === "Employer" && (
                <>
                  <NavLink to="/job/post" label="Post Job" />
                  <NavLink to="/job/me" label="My Jobs" />
                  <NavLink to="/jobseekers" label="Job Seekers" />
                </>
              )}
              
              <NavLink to="/chat" label="Chat" icon={<FaComments />} />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-700">
              {/* Saved Jobs */}
              <Link
                to="/saved-jobs"
                className="hidden lg:flex p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Saved jobs"
              >
                <FaBookmark className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 animate-slide-up">
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="text-xs text-accent-600 hover:text-accent-700 dark:text-accent-400"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() => markAsRead(notification._id)}
                            className={`p-3 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer ${
                              !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                            }`}
                          >
                            <p className={`text-sm ${!notification.read ? 'font-medium' : ''} text-neutral-900 dark:text-neutral-100`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <BsSun className="w-5 h-5 text-amber-500" />
                ) : (
                  <BsMoon className="w-5 h-5 text-neutral-700" />
                )}
              </button>

              {/* Profile Link */}
              <Link
                to="/profile"
                className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Profile
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn-primary text-sm px-3 py-2"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <BsSun className="w-5 h-5 text-amber-500" />
              ) : (
                <BsMoon className="w-5 h-5 text-neutral-700" />
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setShow(!show)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              {show ? (
                <AiOutlineClose className="w-6 h-6" />
              ) : (
                <GiHamburgerMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {show && (
          <div className="md:hidden pb-4 border-t border-neutral-200 dark:border-neutral-700 animate-slide-up">
            <div className="space-y-1 py-2">
              <MobileNavLink to="/" label="Home" onClick={closeMenu} />
              <MobileNavLink to="/job/getall" label="All Jobs" onClick={closeMenu} />
              <MobileNavLink 
                to="/applications/me" 
                label={user?.role === "Employer" ? "Applications" : "My Applications"}
                onClick={closeMenu}
              />
              
              {user?.role === "Employer" && (
                <>
                  <MobileNavLink to="/job/post" label="Post New Job" onClick={closeMenu} />
                  <MobileNavLink to="/job/me" label="My Jobs" onClick={closeMenu} />
                  <MobileNavLink to="/jobseekers" label="Job Seekers" onClick={closeMenu} />
                </>
              )}
              
              <MobileNavLink to="/saved-jobs" label="Saved Jobs" icon={<FaBookmark />} onClick={closeMenu} />
              <MobileNavLink to="/chat" label="Chat" icon={<FaComments />} onClick={closeMenu} />
              <MobileNavLink to="/profile" label="Profile" onClick={closeMenu} />
              
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-accent-600 dark:text-accent-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
  >
    {icon && <span className="mr-1">{icon}</span>}
    {label}
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, label, icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </Link>
);

export default Navbar;
