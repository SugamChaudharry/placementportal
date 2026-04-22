import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Button, Input, Select, FormGroup, Card } from "../UI";
import { Spinner } from "../UI/Loading";
import { FaPhoneFlip } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";

const CompleteProfile = () => {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthorized, user, setUser } = useContext(Context);
  const navigate = useNavigate();

  // If not authorized, redirect to login
  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  // If profile is already complete, redirect to home
  if (user?.isProfileComplete) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!role) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/complete-oauth-profile`,
        { phone, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setUser(data.user);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/careerconnect-white.png"
            alt="CareerConnect"
            className="h-12 w-auto mx-auto dark:invert mb-6"
          />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            We need a few more details to complete your account setup
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Welcome, {user?.name}!</strong><br />
                Your account was created using {user?.provider === "google" ? "Google" : "GitHub"}. 
                Please provide your phone number and confirm your role to continue.
              </p>
            </div>

            {/* Role Selection */}
            <FormGroup label="I am a">
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: "Job Seeker", label: "Job Seeker" },
                  { value: "Employer", label: "Employer" },
                ]}
                placeholder="Select your role"
              />
            </FormGroup>

            {/* Phone Input */}
            <FormGroup label="Phone Number">
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </FormGroup>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading && <Spinner size="sm" className="mr-2" />}
              {loading ? "Completing..." : "Complete Profile"}
            </Button>

            {/* Cancel */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Skip for Now
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          You can update these details later in your profile settings.
        </p>
      </div>
    </div>
  );
};

export default CompleteProfile;
