import React, { useContext, useState } from "react";
import { FaRegUser, FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Button, Input, Select, FormGroup, Card } from "../UI";
import { Spinner } from "../UI/Loading";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !role) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/careerconnect-white.png"
            alt="CareerConnect"
            className="h-12 w-auto mx-auto dark:invert mb-6"
          />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Join CareerConnect today and start your journey
          </p>
        </div>

        {/* Register Form Card */}
        <Card className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Role Selection */}
            <FormGroup label="Register As">
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

            {/* Name Input */}
            <FormGroup label="Full Name">
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>

            {/* Email Input */}
            <FormGroup label="Email Address">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            {/* Phone Input */}
            <FormGroup label="Phone Number">
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormGroup>

            {/* Password Input */}
            <FormGroup label="Password">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                Password should be at least 8 characters with a mix of uppercase, lowercase, numbers and symbols.
              </p>
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
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link to="/login">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Sign In
              </Button>
            </Link>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          By creating an account, you agree to our{" "}
          <Link to="#" className="text-primary-600 dark:text-primary-400 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="text-primary-600 dark:text-primary-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
