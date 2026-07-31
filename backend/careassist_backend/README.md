# CareAssist Backend

Backend for an assistive healthcare platform for elderly users and persons with disabilities.

## Features

- Patient storage
- Medication schedules
- Medication reminder engine
- Emergency contacts
- SOS alerts with GPS coordinates
- Simulated SMS output in terminal
- Caregiver alert API
- Basic health records
- Medication taken/missed status

## Requirements

- Node.js
- MongoDB Community Server or MongoDB Atlas

## Installation

Open terminal inside this folder:

```bash
npm install
```

Make sure MongoDB is running.

Start the server:

```bash
npm run dev
```

or:

```bash
npm start
```

Server:

http://localhost:5000

## API Examples

### Add Patient

POST `/api/patients`

```json
{
  "name": "Test Patient",
  "age": 68,
  "email": "patient@example.com",
  "phone": "9876543210",
  "bloodPressure": "120/80",
  "heartRate": 78
}
```

### Add Medication

POST `/api/medications`

```json
{
  "patientId": "PATIENT_ID",
  "medicineName": "Paracetamol",
  "dosage": "500 mg",
  "reminderTime": "10:30",
  "frequency": "Daily"
}
```

### Add Emergency Contact

POST `/api/contacts`

```json
{
  "patientId": "PATIENT_ID",
  "name": "Daughter",
  "relationship": "Daughter",
  "phone": "9876543210"
}
```

### SOS

POST `/api/alerts/sos`

```json
{
  "patientId": "PATIENT_ID",
  "latitude": 16.8524,
  "longitude": 74.5815
}
```

The server prints a simulated SMS alert in the terminal.

## Main APIs

GET `/`
POST `/api/patients`
GET `/api/patients`
GET `/api/patients/:id`
PUT `/api/patients/:id`

POST `/api/medications`
GET `/api/medications/:patientId`
PUT `/api/medications/:id`
PATCH `/api/medications/:id/taken`
PATCH `/api/medications/:id/missed`
DELETE `/api/medications/:id`

POST `/api/contacts`
GET `/api/contacts/:patientId`
DELETE `/api/contacts/:id`

POST `/api/alerts/sos`
GET `/api/alerts`
GET `/api/alerts/:patientId`
PATCH `/api/alerts/:id/status`

POST `/api/health`
GET `/api/health/:patientId`
