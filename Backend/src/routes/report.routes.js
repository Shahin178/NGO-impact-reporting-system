import express from "express";
import Report from "../models/report.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await Report.updateOne(
      { ngoId: req.body.ngoId, month: req.body.month },
      { $set: req.body },
      { upsert: true }
    );
    res.json({ message: "Report submitted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
