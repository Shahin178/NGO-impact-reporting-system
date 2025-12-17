import mongoose from "mongoose";
import dotenv from "dotenv";
import { Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser";
import Report from "../models/report.model.js";
import Job from "../models/job.model.js";
import redis from "./redis.js";

dotenv.config();

async function startWorker() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ CSV Worker MongoDB connected");

    new Worker(
      "csvQueue",
      async (job) => {
        const { filePath, jobId } = job.data;
        console.log("📥 CSV Worker received job:", jobId);

        try {
          let total = 0;
          let processed = 0;
          let failed = 0;

          await Job.findByIdAndUpdate(jobId, { status: "processing" });

          const rows = [];

          await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
              .pipe(csv())
              .on("data", (row) => rows.push(row))
              .on("end", resolve)
              .on("error", reject);
          });

          for (const row of rows) {
            total++;
            try {
              if (
                !row.ngoId ||
                !row.month ||
                isNaN(row.peopleHelped) ||
                isNaN(row.eventsConducted) ||
                isNaN(row.fundsUtilized)
              ) {
                failed++;
              } else {
                await Report.updateOne(
                  { ngoId: row.ngoId, month: row.month },
                  {
                    $set: {
                      ngoId: row.ngoId,
                      month: row.month,
                      peopleHelped: Number(row.peopleHelped),
                      eventsConducted: Number(row.eventsConducted),
                      fundsUtilized: Number(row.fundsUtilized),
                    },
                  },
                  { upsert: true }
                );
                processed++;
              }

              await Job.findByIdAndUpdate(jobId, {
                totalRows: total,
                processedRows: processed,
                failedRows: failed,
              });
            } catch {
              failed++;
            }
          }

          await Job.findByIdAndUpdate(jobId, { status: "completed" });
          fs.unlink(filePath, () => {});
          console.log("✅ CSV Job completed:", jobId);
        } catch (error) {
          console.error("❌ CSV Worker error:", error);
          await Job.findByIdAndUpdate(jobId, { status: "failed" });
          throw error;
        }
      },
      { connection: redis }
    );

    console.log("✅ CSV Worker started");
  } catch (err) {
    console.error("❌ Worker startup failed:", err);
    process.exit(1);
  }
}

startWorker();
