import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { ChatGroup } from "../models/chatGroupSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG, JPEG, or WEBP file.", 400)
    );
  }
  
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
    }
    
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantID = {
      user: req.user._id,
      role: "Job Seeker",
    };
    
    if (!jobId) {
      return next(new ErrorHandler("Job not found!", 404));
    }
    
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
      return next(new ErrorHandler("Job not found!", 404));
    }

    const employerID = {
      user: jobDetails.postedBy,
      role: "Employer",
    };
    
    if (
      !name ||
      !email ||
      !coverLetter ||
      !phone ||
      !address ||
      !applicantID ||
      !employerID
    ) {
      return next(new ErrorHandler("Please fill all fields.", 400));
    }
    
    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      jobId,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    // Auto-join applicant to job chat group
    try {
      let chatGroup = await ChatGroup.findOne({ job: jobId, type: "job" });
      
      if (!chatGroup) {
        // Create chat group if it doesn't exist
        chatGroup = await ChatGroup.create({
          name: `${jobDetails.title} - Applicants`,
          description: `Discussion group for ${jobDetails.title} position`,
          type: "job",
          job: jobId,
          creator: jobDetails.postedBy,
          members: [
            {
              user: jobDetails.postedBy,
              role: "admin",
              joinedAt: new Date(),
            },
          ],
        });
      }

      // Add applicant as member if not already
      const isMember = chatGroup.members.some(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!isMember) {
        chatGroup.members.push({
          user: req.user._id,
          role: "member",
          joinedAt: new Date(),
        });
        await chatGroup.save();
      }
    } catch (chatError) {
      console.error("Failed to add applicant to chat group:", chatError);
      // Don't fail the application if chat join fails
    }
    
    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    // Handle Cloudinary specific errors
    if (error.message && error.message.includes("api_key")) {
      console.error("Cloudinary API key error:", error.message);
      return next(new ErrorHandler("File upload service configuration error", 500));
    }
    
    // Handle any other errors
    return next(error);
  }
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id })
      .populate("jobId", "title companyName")
      .populate("applicantID.user", "name email phone")
      .populate("employerID.user", "name companyName");
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id })
      .populate("jobId", "title companyName")
      .populate("employerID.user", "name email companyName");
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
