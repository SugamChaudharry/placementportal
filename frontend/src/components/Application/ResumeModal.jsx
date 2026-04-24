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
            <div className="flex flex-col items-center justify-center h-[calc(90vh-140px)] min-h-[500px] text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">PDF Resume</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                  Click below to view the resume in a new tab
                </p>
              </div>
              <button
                onClick={() => window.open(imageUrl + '?fl_attachment=true', '_blank')}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Resume in New Tab
              </button>
            </div>
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
