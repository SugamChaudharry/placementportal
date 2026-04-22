import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Spinner } from "../UI/Loading";
import { Card } from "../UI";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setIsAuthorized, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const success = searchParams.get("success");
      const needsCompletion = searchParams.get("needsCompletion") === "true";
      const token = searchParams.get("token");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError("Authentication failed. Please try again.");
        toast.error("OAuth authentication failed");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      if (!success || !token) {
        setError("Invalid callback response");
        toast.error("Authentication error");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        // The token is already set in cookie by backend, but we need to fetch user data
        // Use the token from query param for the Authorization header
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getuser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthorized(true);
          toast.success("Successfully logged in!");

          if (needsCompletion) {
            // Redirect to profile completion page
            navigate("/complete-profile");
          } else {
            // Redirect to home
            navigate("/");
          }
        } else {
          throw new Error("Failed to get user data");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err.response?.data?.message || "Failed to complete authentication");
        toast.error("Authentication failed");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setIsAuthorized, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Completing Sign In...
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Please wait while we verify your account.
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Authentication Error
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">{error}</p>
          <p className="text-sm text-neutral-500">Redirecting to login...</p>
        </Card>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
