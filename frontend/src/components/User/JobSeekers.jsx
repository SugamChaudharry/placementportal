import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaCalendar } from "react-icons/fa";

const JobSeekers = () => {
  const { isAuthorized, user } = useContext(Context);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/jobseekers`,
          { withCredentials: true }
        );
        setJobSeekers(data.jobSeekers);
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

  const filteredJobSeekers = jobSeekers.filter(
    (seeker) =>
      seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "Employer") {
    return <Navigate to="/" />;
  }

  return (
    <div className="jobSeekers page">
      <div className="container">
        <h1>Job Seekers</h1>
        <p className="subtitle">Browse and find potential candidates</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="stats">
              <span>Total Job Seekers: {jobSeekers.length}</span>
              <span>Showing: {filteredJobSeekers.length}</span>
            </div>

            <div className="jobSeekers-grid">
              {filteredJobSeekers.length > 0 ? (
                filteredJobSeekers.map((seeker) => (
                  <div className="jobSeeker-card" key={seeker._id}>
                    <div className="card-header">
                      <div className="avatar">
                        <FaUser />
                      </div>
                      <h3>{seeker.name}</h3>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <FaEnvelope />
                        <span>{seeker.email}</span>
                      </div>
                      <div className="info-row">
                        <FaPhone />
                        <span>{seeker.phone}</span>
                      </div>
                      <div className="info-row">
                        <FaCalendar />
                        <span>
                          Joined: {new Date(seeker.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  {searchTerm
                    ? "No job seekers found matching your search"
                    : "No job seekers available"}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobSeekers;
