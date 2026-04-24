import React from "react";
import { FaTimes, FaDownload } from "react-icons/fa";

const ResumeModal = ({ imageUrl, onClose }) => {
  const isPDF = imageUrl?.toLowerCase().endsWith(".pdf") || 
              imageUrl?.includes("/pdf") || 
              imageUrl?.includes("application/pdf") ||
              imageUrl?.includes("/raw/upload/");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = isPDF
      ? imageUrl.replace("/image/upload/", "/raw/upload/")
      : imageUrl;
    link.download = isPDF ? "resume.pdf" : "resume";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-neutral-900 rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Resume Preview
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              <FaDownload /> Download
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] bg-neutral-100 dark:bg-neutral-800">
          {isPDF ? (
            <iframe
              src={imageUrl}
              title="Resume PDF"
              className="w-full rounded-lg shadow-lg"
              style={{ height: "calc(90vh - 140px)", minHeight: "500px" }}
            />
          ) : (
            <img
              src={imageUrl}
              alt="Resume"
              className="w-full h-auto max-w-full rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
