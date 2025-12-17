# NGO Impact Reporting System

This project is a full‑stack web application built as part of the **SDE I Take‑Home Assignment**. It enables NGOs to submit monthly impact reports (individually or in bulk via CSV) and allows an admin to view aggregated impact data through a dashboard. The system is designed to be scalable, fault‑tolerant, and capable of handling background processing for large CSV uploads.

---

## 🧩 Problem Statement (Summary)

We work with NGOs across India to help them track and report the impact of their work. The goal of this application is to:

- Allow NGOs to submit **monthly reports**
- Support **bulk uploads** via CSV files
- Process large inputs **asynchronously in the background**
- Handle **partial failures** gracefully (invalid rows should not fail the entire upload)
- Provide **job status tracking** for bulk uploads
- Show an **admin dashboard** with aggregated impact metrics

---

## 🚀 Features Implemented

### Frontend (React + Tailwind CSS)

1. **Report Submission Form**

   - Submit a single NGO monthly report
   - Fields:

     - NGO ID
     - Month (YYYY-MM)
     - People Helped
     - Events Conducted
     - Funds Utilized

2. **Bulk Report Upload (CSV)**

   - Upload CSV file containing multiple reports
   - Receives a `jobId` from backend
   - Polls job status every few seconds
   - Displays:

     - Processed rows
     - Failed rows
     - Current status (processing / completed)

3. **Admin Dashboard**

   - View aggregated data for a selected month
   - Metrics:

     - Total NGOs Reporting
     - Total People Helped
     - Total Events Conducted
     - Total Funds Utilized

---

### Backend (Node.js + Express)

#### API Endpoints

| Method | Endpoint                   | Description                                |
| ------ | -------------------------- | ------------------------------------------ |
| POST   | `/report`                  | Submit a single monthly report             |
| POST   | `/reports/upload`          | Upload CSV file (processed asynchronously) |
| GET    | `/job-status/:jobId`       | Get CSV processing status                  |
| GET    | `/dashboard?month=YYYY-MM` | Aggregated dashboard data                  |

#### Background Processing

- **BullMQ + Redis** used for background CSV processing
- CSV rows are processed **asynchronously**
- Job progress is stored in MongoDB and polled by frontend
- Invalid rows are counted as failures without stopping the job

#### Idempotency

- Reports are **upserted** using `(ngoId + month)`
- Prevents duplicate counting for the same NGO/month

---

## 🛠 Tech Stack

### Frontend

- React
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- BullMQ (Queue + Worker)
- Redis (via Docker)
- MongoDB (Mongoose)
- Multer (file uploads)
- csv-parser

### Infrastructure / Tools

- Docker (Redis)
- Nodemon (development)

---

## 🗂 Project Architecture (High Level)

```
Frontend (React)
   |
   | REST APIs
   v
Backend (Express)
   |
   | Enqueue CSV job
   v
BullMQ Queue  --->  Redis
   |
   | Worker processes CSV
   v
MongoDB (Reports + Jobs)
```

---

## 📦 Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Atlas)
- Docker (for Redis)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shahin178/NGO-impact-reporting-system.git
cd backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Start Redis Using Docker

```bash
docker run -d \
  --name redis-stack \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest
```

---

### 4️⃣ Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://banoshahin89_db_user:lBJr1KTnPANwVjP5@cluster0.71znomu.mongodb.net/
```

---

### 5️⃣ Start Backend Server

```bash
npm run dev
```

You should see:

```
✅ Redis connected successfully
✅ CSV Worker started
✅ Server running on http://localhost:5000
```

---

### 6️⃣ Start Frontend

```bash
npm install
npm run dev
```

---

## 📄 Sample CSV Format

```csv
ngoId,month,peopleHelped,eventsConducted,fundsUtilized
NGO001,2024-01,120,5,15000
NGO002,2024-01,200,8,30000
NGO003,2024-01,50,2,8000
NGO005,2024-01,abc,4,10000   # invalid row
```

Invalid rows are counted as failures and do not block processing.

---

## 📊 Job Status Response Example

```json
{
  "totalRows": 8,
  "processedRows": 6,
  "failedRows": 2,
  "status": "completed"
}
```

---

## 🤖 Use of AI Tools

AI tools (ChatGPT) were used for:

- Debugging async CSV stream issues
- Improving BullMQ worker design
- Structuring the README and architecture explanations

All logic decisions and final implementation were reviewed and understood before integration.

---

## � Deployment with Docker

To deploy the application using Docker, follow these steps:

### Prerequisites

- Docker and Docker Compose installed on your system

### Steps

1. **Clone the repository** (if not already done)

   ```bash
   git clone <repository-url>
   cd wedogood-assignment
   ```

2. **Build and run the services**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: https://ngo-impact-reporting-system-frontend.onrender.com/dashboard
   - Backend API: https://ngo-impact-reporting-system-backend.onrender.com/
   - GitHub Repo: https://github.com/Shahin178/NGO-impact-reporting-system

### Services

- **MongoDB**: Database for storing reports and jobs
- **Redis**: Queue for background CSV processing
- **Backend**: Node.js API server
- **Frontend**: React app served by Nginx

### Environment Variables

The following environment variables are set in `docker-compose.yml`:

- `MONGODB_URI`: mongodb+srv://banoshahin89_db_user:lBJr1KTnPANwVjP5@cluster0.71znomu.mongodb.net/
- `PORT`: 5000
- `REDIS_HOST`: redis
- `REDIS_PORT`: 6379
- `REDIS_URL`: redis://red-d511rd6r433s739ndcag:6379

For production, consider using a `.env` file and updating the compose file accordingly.

### Volumes

- `mongodb_data`: Persists MongoDB data
- `redis_data`: Persists Redis data
- `./Backend/uploads`: Mounts upload directory for file persistence

---

## �🔮 Improvements With More Time

- Retry logic for failed CSV rows
- Pagination and filters in admin dashboard
- Authentication for admin routes
- Rate limiting and file size limits
- Structured logging and metrics
- CI/CD pipeline and Docker Compose

---

## 🎯 Conclusion

This project demonstrates:

- Background job processing using BullMQ
- Handling partial failures at scale
- Idempotent data ingestion
- Clean separation of frontend, API, and worker logic

The focus was correctness, scalability, and clarity over UI polish, in line with the assignment expectations.

---

**Author:** Shahin Bano
**Role Target:** SDE I
