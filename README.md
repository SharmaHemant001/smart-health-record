# MedMemory Backend

MedMemory is a healthcare hackathon backend that manages patient history and produces smart insights.

It provides:
- Patient profile management
- Medication, visit, and lab tracking
- Rule-based alert generation
- AI-generated clinical summary endpoint
- JWT authentication for protected resources

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt
- dotenv
- cors
- helmet
- morgan
- express-validator
- axios
- nodemon

## Project Structure

```text
backend/
|-- src/
|   |-- config/
|   |   |-- db.js
|   |   |-- env.js
|   |-- models/
|   |   |-- User.js
|   |   |-- Patient.js
|   |   |-- Medication.js
|   |   |-- Visit.js
|   |   |-- Lab.js
|   |   |-- Alert.js
|   |   |-- Summary.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- patientController.js
|   |   |-- medicationController.js
|   |   |-- visitController.js
|   |   |-- labController.js
|   |   |-- summaryController.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- patientRoutes.js
|   |   |-- medicationRoutes.js
|   |   |-- visitRoutes.js
|   |   |-- labRoutes.js
|   |   |-- summaryRoutes.js
|   |-- middleware/
|   |   |-- authMiddleware.js
|   |   |-- errorHandler.js
|   |-- services/
|   |   |-- alertService.js
|   |   |-- aiService.js
|   |-- utils/
|   |   |-- generateToken.js
|   |-- app.js
|-- server.js
|-- package.json
|-- .env.example
|-- README.md
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Copy and configure environment variables:
```bash
cp .env.example .env
```

3. Start in development mode:
```bash
npm run dev
```

4. Start in production mode:
```bash
npm start
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
AI_API_URL=https://mock-ai-service
```

## API Documentation

Base URL: `http://localhost:5000`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Patients
- `POST /api/patients`
- `GET /api/patients`
- `GET /api/patients/:id`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Medications
- `POST /api/patients/:id/medications`
- `GET /api/patients/:id/medications`

### Visits
- `POST /api/patients/:id/visits`
- `GET /api/patients/:id/visits`

### Labs
- `POST /api/patients/:id/labs`
- `GET /api/patients/:id/labs`

### Alerts
- `GET /api/patients/:id/alerts`

### Summary
- `POST /api/patients/:id/generate-summary`
- `GET /api/patients/:id/summary`

## Authentication

All `/api/patients*` endpoints require:

```http
Authorization: Bearer <jwt_token>
```

## Example Requests

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Dr. Maya\",\"email\":\"maya@example.com\",\"password\":\"secret123\",\"role\":\"doctor\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"maya@example.com\",\"password\":\"secret123\"}"
```

### Create Patient

```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d "{\"name\":\"John Doe\",\"age\":45,\"gender\":\"male\",\"phone\":\"1234567890\",\"bloodGroup\":\"O+\",\"allergies\":[\"Penicillin\"],\"chronicConditions\":[\"Diabetes\"]}"
```

### Add Lab

```bash
curl -X POST http://localhost:5000/api/patients/<patient_id>/labs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d "{\"testName\":\"Fasting Glucose\",\"value\":180,\"unit\":\"mg/dL\",\"normalRange\":\"70-99\",\"date\":\"2026-02-14\"}"
```

### Generate AI Summary

```bash
curl -X POST http://localhost:5000/api/patients/<patient_id>/generate-summary \
  -H "Authorization: Bearer <jwt_token>"
```

## Smart Feature Behavior

- Abnormal lab alert:
  - Generated when lab value falls outside `normalRange` (`low-high`, `<x`, `>x`).
- Missed follow-up alert:
  - Generated when `followUpDate` is earlier than current date.
- Medication adherence alert:
  - Generated when `adherenceStatus` is `missed` or `poor`.
- AI summary:
  - Tries external API (`AI_API_URL`) via axios.
  - Falls back to local summary if external service is unavailable.
