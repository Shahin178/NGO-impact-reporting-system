import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import reportRoutes from "./routes/report.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import jobRoutes from "./routes/job.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/report", reportRoutes);
app.use("/reports/upload", uploadRoutes);
app.use("/job-status", jobRoutes);
app.use("/dashboard", dashboardRoutes);

const startServer = async () => {
  try {
    await connectDB();
    // Import worker after DB connection
    await import("./config/csvWorker.js");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
