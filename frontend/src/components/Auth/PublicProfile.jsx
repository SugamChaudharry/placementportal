import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaComment } from "react-icons/fa";

const PublicProfile = () => {
  const { isAuthorized, user: currentUser } = useContext(Context);
  const { pid } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${pid}`,
          { withCredentials: true }
        );
        setProfileUser(data.user);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && pid) {
      fetchProfile();
    }
  }, [isAuthorized, pid]);

  const handleStartChat = () => {
    if (!profileUser) return;
    // Navigate to chat page with this user selected
    navigate("/chat", { state: { startChatWith: profileUser } });
  };

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  // Don't show own profile on public profile page
  if (currentUser?._id === pid) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return (
      <div className="public-profile page">
        <div className="container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="public-profile page">
        <div className="container">
          <div className="not-found">
            <h2>User Not Found</h2>
            <p>The user profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-profile page">
      <div className="container">
        <div className="profile-card public">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <div className="profile-title">
              <h1>{profileUser.name}</h1>
              <span className={`role-badge ${profileUser.role.toLowerCase().replace(" ", "-")}`}>
                {profileUser.role}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <FaEnvelope />
              <div>
                <label>Email</label>
                <p>{profileUser.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaPhone />
              <div>
                <label>Phone</label>
                <p>{profileUser.phone}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaCalendar />
              <div>
                <label>Member Since</label>
                <p>{new Date(profileUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="chat-btn" onClick={handleStartChat}>
              <FaComment /> Chat with {profileUser.name.split(" ")[0]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
