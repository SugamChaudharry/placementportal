import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { isAuthorized, user, setUser } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update`,
        updateData,
        { withCredentials: true }
      );

      toast.success(data.message);
      setUser(data.user);
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile page">
      <div className="container">
        <h1>My Profile</h1>
        <div className="profile-card">
          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-field">
                <label>Name:</label>
                <p>{user?.name}</p>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <p>{user?.email}</p>
              </div>
              <div className="profile-field">
                <label>Phone:</label>
                <p>{user?.phone}</p>
              </div>
              <div className="profile-field">
                <label>Role:</label>
                <p className="role-badge">{user?.role}</p>
              </div>
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength={3}
                  maxLength={30}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="disabled"
                />
                <small>Email cannot be changed</small>
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <input
                  type="text"
                  value={user?.role}
                  disabled
                  className="disabled"
                />
              </div>
              <hr />
              <h3>Change Password (Optional)</h3>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min 8 chars)"
                  minLength={8}
                />
              </div>
              <div className="button-group">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || "",
                      phone: user?.phone || "",
                      currentPassword: "",
                      newPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
