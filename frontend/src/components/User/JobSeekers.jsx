import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Navigate, Link } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input, PageHeader, Container, Badge, SkeletonLoader, ProfileModal } from "../UI";

const JobSeekers = () => {
  const { isAuthorized, user } = useContext(Context);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/jobseekers`,
          { withCredentials: true }
        );
        setJobSeekers(data.jobSeekers || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch job seekers");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && user?.role === "Employer") {
      fetchJobSeekers();
    }
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "Employer") {
    return <Navigate to="/" />;
  }

  const filteredJobSeekers = jobSeekers.filter(
    (seeker) =>
      seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfileClick = (seeker) => {
    setSelectedProfile(seeker);
    setProfileModalOpen(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader 
        title="Discover Talent" 
        subtitle="Browse and connect with potential candidates"
      />

      <Container className="py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
          <div className="flex gap-4 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Total: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{jobSeekers.length}</span>
            </span>
            <span className="text-neutral-600 dark:text-neutral-400">
              Showing: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{filteredJobSeekers.length}</span>
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : filteredJobSeekers.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No candidates found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No job seekers available at the moment"}
            </p>
          </div>
        ) : (
          /* Grid of Job Seekers */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobSeekers.map((seeker) => (
              <JobSeekerCard
                key={seeker._id}
                seeker={seeker}
                onClick={() => handleProfileClick(seeker)}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={selectedProfile}
      />
    </main>
  );
};

export default JobSeekers;

const JobSeekerCard = ({ seeker, onClick }) => {
  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine experience level based on some criteria
  const getExperienceLevel = (yearsExp) => {
    if (!yearsExp) return "Entry Level";
    if (yearsExp <= 2) return "Entry Level";
    if (yearsExp <= 5) return "Mid Level";
    return "Senior";
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group h-full"
    >
      <div className="h-full p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-lg dark:hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-1">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold mb-3 group-hover:shadow-lg transition-shadow">
            {getInitials(seeker.name)}
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-2">
            {seeker.name}
          </h3>
          <Badge variant="info" size="sm">
            {getExperienceLevel(seeker.yearsOfExperience)}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
            📧 {seeker.email}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
            📱 {seeker.phone || "N/A"}
          </p>
        </div>

        {/* Top Skills Preview */}
        {seeker.skills && seeker.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Top Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {seeker.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {skill}
                </Badge>
              ))}
              {seeker.skills.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{seeker.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* View Profile Button */}
        <Link 
          to={`/user/profile/${seeker._id}`}
          className="block w-full py-2 px-3 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm text-center"
          onClick={(e) => e.stopPropagation()}
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};
