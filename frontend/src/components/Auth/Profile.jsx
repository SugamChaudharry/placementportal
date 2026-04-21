import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { FaUser, FaEdit, FaTimes, FaCheck, FaBriefcase, FaCertificate } from "react-icons/fa";
import { Button, Card, Input, FormGroup, Badge, PageHeader, Container } from "../UI";

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

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const stats = [
    { label: "Role", value: user?.role || "N/A", icon: FaBriefcase },
    { label: "Email", value: user?.email || "N/A", icon: FaUser },
    { label: "Member Since", value: new Date(user?.createdAt).toLocaleDateString() || "N/A", icon: FaCertificate },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader title="My Profile" subtitle="Manage your account information" />

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6 text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {getInitials(user?.name)}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {user?.name}
                </h2>

                {/* Role Badge */}
                <Badge variant="primary" className="mb-4">
                  {user?.role}
                </Badge>

                {/* Edit Button */}
                <Button
                  variant={isEditing ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full"
                >
                  {isEditing ? (
                    <>
                      <FaTimes /> Cancel Edit
                    </>
                  ) : (
                    <>
                      <FaEdit /> Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-6">
            {!isEditing ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <stat.icon />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">{stat.label}</p>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Details Card */}
                <Card>
                  <Card.Header>Profile Information</Card.Header>
                  <Card.Body>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Full Name
                        </label>
                        <p className="text-neutral-900 dark:text-neutral-100 mt-1">{user?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Email Address
                        </label>
                        <p className="text-neutral-900 dark:text-neutral-100 mt-1">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Phone Number
                        </label>
                        <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                          {user?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </>
            ) : (
              /* Edit Form */
              <Card>
                <Card.Header>Edit Profile</Card.Header>
                <Card.Body>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <FormGroup label="Full Name" required>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        minLength={3}
                        maxLength={30}
                        required
                      />
                    </FormGroup>

                    {/* Email Field (Disabled) */}
                    <FormGroup label="Email Address">
                      <Input
                        type="email"
                        value={user?.email}
                        disabled
                        placeholder="Email cannot be changed"
                      />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Email address cannot be changed
                      </p>
                    </FormGroup>

                    {/* Phone Field */}
                    <FormGroup label="Phone Number" required>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </FormGroup>

                    {/* Role Field (Disabled) */}
                    <FormGroup label="Account Role">
                      <Input
                        type="text"
                        value={user?.role}
                        disabled
                        placeholder="Role cannot be changed"
                      />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Contact support to change your account role
                      </p>
                    </FormGroup>

                    {/* Password Change Section */}
                    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                        Change Password (Optional)
                      </h3>

                      <FormGroup label="Current Password">
                        <Input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                        />
                      </FormGroup>

                      <FormGroup label="New Password">
                        <Input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter a new password (minimum 8 characters)"
                          minLength={8}
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Leave blank to keep your current password
                        </p>
                      </FormGroup>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user?.name || "",
                            phone: user?.phone || "",
                            currentPassword: "",
                            newPassword: "",
                          });
                        }}
                        className="flex-1"
                      >
                        <FaTimes /> Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? "Saving..." : <><FaCheck /> Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Profile;
