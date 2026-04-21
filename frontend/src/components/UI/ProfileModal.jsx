import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaBriefcase, FaEnvelope, FaPhone, FaStar } from "react-icons/fa";
import { Modal, Button, Badge } from "./index";

export const ProfileModal = ({ isOpen, onClose, profile }) => {
  if (!profile) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Profile Preview"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with Avatar */}
        <div className="flex items-center space-x-4 pb-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {profile.name}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {profile.role === "Job Seeker" ? "Job Seeker" : "Professional"}
            </p>
            {profile.rate && (
              <div className="flex items-center mt-2 text-sm">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  {profile.rating || "No ratings yet"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900 dark:text-white">Contact</h4>
          <div className="space-y-2 text-sm">
            {profile.email && (
              <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                <FaEnvelope className="mr-3 text-primary-600" />
                {profile.email}
              </div>
            )}
            {profile.phoneNumber && (
              <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                <FaPhone className="mr-3 text-primary-600" />
                {profile.phoneNumber}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900 dark:text-white">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="primary" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience Summary */}
        {profile.experience && (
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center">
              <FaBriefcase className="mr-2 text-primary-600" />
              Experience
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {profile.experience}
            </p>
          </div>
        )}

        {/* Education */}
        {profile.education && (
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center">
              <FaGraduationCap className="mr-2 text-primary-600" />
              Education
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {profile.education}
            </p>
          </div>
        )}

        {/* About */}
        {profile.aboutMe && (
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900 dark:text-white">About</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
              {profile.aboutMe}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link to={`/user/profile/${profile._id}`} className="flex-1">
            <Button variant="primary" className="w-full">
              View Full Profile
            </Button>
          </Link>
          <Link to={`/chat?userId=${profile._id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Send Message
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
