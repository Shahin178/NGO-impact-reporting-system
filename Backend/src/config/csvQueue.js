import { Queue } from "bullmq";
import redis from "./redis.js";

let queue;
try {
  queue = new Queue("csvQueue", { connection: redis });
} catch (error) {
  console.error("❌ Failed to create CSV Queue:", error.message);
  queue = null;
}

export default queue;
