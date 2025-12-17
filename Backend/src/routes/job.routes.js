import express from "express";
import Job from "../models/job.model.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });

  res.status(200).json(job);
});

export default router;
