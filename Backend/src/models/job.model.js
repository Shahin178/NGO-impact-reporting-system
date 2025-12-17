import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  totalRows: Number,
  processedRows: { type: Number, default: 0 },
  failedRows: { type: Number, default: 0 },
  status: { type: String, default: "processing" },
});

export default mongoose.model("Job", jobSchema);
