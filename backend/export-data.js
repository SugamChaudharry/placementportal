import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models/userSchema.js";
import { Job } from "./models/jobSchema.js";
import { Application } from "./models/applicationSchema.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadFile(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    await fs.writeFile(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
    return false;
  }
}

async function exportData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const exportDir = path.join(__dirname, `export_${timestamp}`);
  const resumesDir = path.join(exportDir, "resumes");

  await fs.mkdir(exportDir, { recursive: true });
  await fs.mkdir(resumesDir, { recursive: true });

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.DB_URL, { dbName: "Job_Portal" });
  console.log("Connected successfully!\n");

  console.log("Exporting users...");
  const users = await User.find({}).lean();
  await fs.writeFile(
    path.join(exportDir, "users.json"),
    JSON.stringify(users, null, 2)
  );
  console.log(`  ✓ Exported ${users.length} users\n`);

  console.log("Exporting jobs...");
  const jobs = await Job.find({}).lean();
  await fs.writeFile(
    path.join(exportDir, "jobs.json"),
    JSON.stringify(jobs, null, 2)
  );
  console.log(`  ✓ Exported ${jobs.length} jobs\n`);

  console.log("Exporting applications and downloading resumes...");
  const applications = await Application.find({}).lean();
  
  let downloadCount = 0;
  let failCount = 0;
  const applicationsWithLocalPaths = [];

  for (let i = 0; i < applications.length; i++) {
    const app = applications[i];
    const resumeUrl = app.resume?.url;
    
    if (resumeUrl) {
      const ext = path.extname(new URL(resumeUrl).pathname) || ".pdf";
      const localFilename = `resume_${String(i + 1).padStart(3, "0")}_${app._id}${ext}`;
      const localPath = path.join(resumesDir, localFilename);
      
      const success = await downloadFile(resumeUrl, localPath);
      
      if (success) {
        downloadCount++;
        applicationsWithLocalPaths.push({
          ...app,
          resume: {
            ...app.resume,
            localPath: `./resumes/${localFilename}`,
            originalUrl: resumeUrl
          }
        });
      } else {
        failCount++;
        applicationsWithLocalPaths.push({
          ...app,
          resume: {
            ...app.resume,
            localPath: null,
            originalUrl: resumeUrl,
            downloadError: "Failed to download"
          }
        });
      }
    } else {
      applicationsWithLocalPaths.push(app);
    }
  }

  await fs.writeFile(
    path.join(exportDir, "applications.json"),
    JSON.stringify(applicationsWithLocalPaths, null, 2)
  );
  console.log(`  ✓ Exported ${applications.length} applications`);
  console.log(`  ✓ Downloaded ${downloadCount} resumes`);
  if (failCount > 0) console.log(`  ✗ Failed to download ${failCount} resumes`);

  await mongoose.disconnect();
  console.log(`\n✅ Export complete! Files saved to: ${exportDir}`);
  console.log("\nExported files:");
  console.log(`  - users.json (${users.length} records)`);
  console.log(`  - jobs.json (${jobs.length} records)`);
  console.log(`  - applications.json (${applications.length} records)`);
  console.log(`  - resumes/ (${downloadCount} files)`);
}

exportData().catch((error) => {
  console.error("Export failed:", error);
  process.exit(1);
});
