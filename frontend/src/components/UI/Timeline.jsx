import React from "react";
import { 
  FaCheckCircle, 
  FaEye, 
  FaCalendar, 
  FaStar, 
  FaTimes,
  FaPaperPlane
} from "react-icons/fa";

export const ApplicationTimeline = ({ application }) => {
  const getStatusColor = (status) => {
    const colorMap = {
      "Applied": "blue",
      "Reviewed": "purple", 
      "Shortlisted": "green",
      "Interview": "orange",
      "Offered": "green",
      "Rejected": "red",
    };
    return colorMap[status] || "neutral";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      "Applied": <FaPaperPlane />,
      "Reviewed": <FaEye />,
      "Shortlisted": <FaCheckCircle />,
      "Interview": <FaCalendar />,
      "Offered": <FaStar />,
      "Rejected": <FaTimes />,
    };
    return iconMap[status];
  };

  // Sort timeline by date (most recent first)
  const sortedTimeline = [...(application.timeline || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const bgColorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    neutral: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200",
  };

  return (
    <div className="space-y-8">
      {sortedTimeline.map((status, index) => {
        const colorClass = getStatusColor(status.status);
        const isLast = index === sortedTimeline.length - 1;

        return (
          <div key={`${status.date}-${index}`} className="flex gap-4">
            {/* Timeline Line and Dot */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${bgColorClasses[colorClass]} flex items-center justify-center text-lg border-2 border-white dark:border-neutral-800`}>
                {getStatusIcon(status.status)}
              </div>
              {!isLast && (
                <div className={`w-1 h-16 bg-gradient-to-b from-${colorClass}-300 to-neutral-300 dark:from-${colorClass}-700 dark:to-neutral-700 my-2`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4 md:pb-0">
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    {status.status}
                  </h4>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(status.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {status.notes && (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {status.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Standalone Timeline Status Badge Component
export const TimelineStatusBadge = ({ status }) => {
  const statusColors = {
    "Applied": "blue",
    "Reviewed": "purple",
    "Shortlisted": "green",
    "Interview": "orange",
    "Offered": "green",
    "Rejected": "red",
  };

  const bgColorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  };

  const color = statusColors[status] || "neutral";
  const bgClass = bgColorClasses[color];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgClass}`}>
      {status}
    </span>
  );
};
