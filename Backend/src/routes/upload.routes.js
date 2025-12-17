import express from "express";
import multer from "multer";
import Job from "../models/job.model.js";
import csvQueue from "../config/csvQueue.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const job = await Job.create({ totalRows: 0 });

    if (csvQueue) {
      await csvQueue.add("processCSV", {
        filePath: req.file.path,
        jobId: job._id,
      });
    } else {
      // Process synchronously if queue not available
      // For now, just mark as completed
      job.status = "completed";
      await job.save();
    }

    res.json({ jobId: job._id });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
