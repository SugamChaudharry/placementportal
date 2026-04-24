import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/Job_Portal";

async function importCollection(collectionName, filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const documents = JSON.parse(data);

    if (!Array.isArray(documents) || documents.length === 0) {
      console.log(`  ⚠ No documents found in ${collectionName}`);
      return 0;
    }

    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    await collection.deleteMany({});

    const docsToInsert = documents.map((doc) => {
      const newDoc = { ...doc };
      delete newDoc.__v;
      if (newDoc._id && typeof newDoc._id === "string") {
        newDoc._id = new mongoose.Types.ObjectId(newDoc._id);
      }
      return newDoc;
    });

    const result = await collection.insertMany(docsToInsert);
    console.log(`  ✓ Imported ${result.insertedCount} documents to ${collectionName}`);
    return result.insertedCount;
  } catch (error) {
    console.error(`  ✗ Failed to import ${collectionName}: ${error.message}`);
    return 0;
  }
}

async function importData() {
  const exportDir = process.argv[2];

  if (!exportDir) {
    const dirs = await fs.readdir(__dirname);
    const exportDirs = dirs.filter((d) => d.startsWith("export_"));
    if (exportDirs.length === 0) {
      console.error("Error: No export directory found. Please provide export folder path.");
      console.error("Usage: node import-data.js <export-folder>");
      process.exit(1);
    }
    exportDirs.sort().reverse();
    const autoDir = path.join(__dirname, exportDirs[0]);
    console.log(`Using latest export: ${exportDirs[0]}\n`);
    return importFromDir(autoDir);
  }

  const fullPath = path.resolve(exportDir);
  return importFromDir(fullPath);
}

async function importFromDir(exportDir) {
  const DB_URL_WITH_DB = DB_URL.includes("?") 
    ? DB_URL.replace("?", "/Job_Portal?")
    : DB_URL + "/Job_Portal";
  console.log("Connecting to MongoDB...");
  await mongoose.connect(DB_URL_WITH_DB);
  console.log("Connected successfully to database: Job_Portal\n");

  let total = 0;

  const collections = [
    { name: "users", file: "users.json" },
    { name: "jobs", file: "jobs.json" },
    { name: "applications", file: "applications.json" },
  ];

  for (const { name, file } of collections) {
    const filePath = path.join(exportDir, file);
    console.log(`Importing ${name}...`);
    try {
      await fs.access(filePath);
      const count = await importCollection(name, filePath);
      total += count;
    } catch {
      console.log(`  ⚠ File not found: ${file}`);
    }
  }

  await mongoose.disconnect();
  console.log(`\n✅ Import complete! Total documents imported: ${total}`);
  console.log(`\nDatabase: Job_Portal`);
  console.log(`Collections: users, jobs, applications`);
}

importData().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
