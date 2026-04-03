"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProfilePage from "@/components/pages/ProfilePage";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/lib/services/user.service";

export default function ProfileRoute() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try to get detailed profile from API
        const response = await userService.getProfile();
        setUserData(response.data);
      } catch (err) {
        // Fallback to auth store data
        setUserData(authUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Profile content */}
      <div className="p-6" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <ProfilePage user={userData} setPage={() => {}} />
      </div>
    </div>
  );
}
