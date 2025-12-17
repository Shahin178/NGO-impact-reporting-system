import express from "express";
import Report from "../models/report.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const month = req.query.month;

  const data = await Report.aggregate([
    { $match: { month } },
    {
      $group: {
        _id: null,
        totalNGOs: { $addToSet: "$ngoId" },
        peopleHelped: { $sum: "$peopleHelped" },
        eventsConducted: { $sum: "$eventsConducted" },
        fundsUtilized: { $sum: "$fundsUtilized" },
      },
    },
  ]);

  res.json({
    totalNGOs: data[0]?.totalNGOs.length || 0,
    peopleHelped: data[0]?.peopleHelped || 0,
    eventsConducted: data[0]?.eventsConducted || 0,
    fundsUtilized: data[0]?.fundsUtilized || 0,
  });
});

export default router;
