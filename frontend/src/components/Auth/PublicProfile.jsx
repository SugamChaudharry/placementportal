import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FaEnvelope, FaPhone, FaCalendar, FaComment, FaBriefcase, FaArrowLeft } from "react-icons/fa";
import { Button, Card, Badge, PageHeader, Container, SkeletonLoader } from "../UI";

const PublicProfile = () => {
  const { isAuthorized, user: currentUser } = useContext(Context);
  const { pid } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
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
    navigate("/chat", { state: { startChatWith: profileUser } });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  if (currentUser?._id === pid) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <PageHeader title="Profile" subtitle="Loading..." />
        <Container className="py-8">
          <SkeletonLoader count={3} />
        </Container>
      </main>
    );
  }

  if (!profileUser) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <PageHeader title="Profile Not Found" subtitle="The profile you're looking for doesn't exist" />
        <Container className="py-8">
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">👤</div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              User Not Found
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              The user profile you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="primary" onClick={handleGoBack}>
              <FaArrowLeft /> Go Back
            </Button>
          </Card>
        </Container>
      </main>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const roleColors = {
    "Job Seeker": "success",
    Employer: "primary",
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader 
        title={profileUser.name} 
        subtitle={`${profileUser.role} • Member since ${new Date(profileUser.createdAt).toLocaleDateString()}`}
      />

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6 text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {getInitials(profileUser.name)}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {profileUser.name}
                </h2>

                {/* Role Badge */}
                <Badge variant={roleColors[profileUser.role] || "info"} className="mb-4">
                  {profileUser.role}
                </Badge>

                {/* Message Button */}
                <Button
                  variant="primary"
                  onClick={handleStartChat}
                  className="w-full"
                >
                  <FaComment /> Send Message
                </Button>
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <Card.Header>Contact Information</Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:pb-0 last:border-b-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                      <FaEnvelope />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 uppercase font-semibold">
                        Email
                      </label>
                      <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                        {profileUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:pb-0 last:border-b-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                      <FaPhone />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 uppercase font-semibold">
                        Phone
                      </label>
                      <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                        {profileUser.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                      <FaCalendar />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 uppercase font-semibold">
                        Member Since
                      </label>
                      <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                        {new Date(profileUser.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Role Info Card */}
            <Card>
              <Card.Header>Account Information</Card.Header>
              <Card.Body>
                <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaBriefcase />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Account Type</p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {profileUser.role}
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default PublicProfile;
