# Student–Teacher Booking Appointment

Student–Teacher Booking Appointment is a web-based application that helps students book appointments with teachers in a simple and organized way. It improves communication by allowing students to request time slots and teachers to manage and respond to those requests efficiently.

---

## Features

### Student
- Register and log in securely  
- View available teachers and their time slots  
- Book appointment requests with a teacher  
- Add purpose or notes while booking  
- Track appointment status (pending, approved, rejected)  

### Teacher
- Log in to the system  
- View appointment requests from students  
- Approve or reject appointment requests  
- Manage availability and time slots  

### Admin
- Manage students and teachers  
- Monitor appointment activity  
- Control system access  

---

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- shadcn/ui
- React Query
- Zod

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Tools
- Axios
- JWT Authentication

---

## How It Works

1. Students register and log in  
2. Teachers set their availability  
3. Students select a date and available time slot  
4. Appointment request is sent to the teacher  
5. Teacher approves or rejects the request  
6. Student can view the updated appointment status  

---

## Installation and Setup

### Clone the repository
```bash
git clone https://github.com/your-username/student-teacher-booking.git
cd student-teacher-booking
```

### Frontend Setup 
```bash
cd client
npm install
npm run dev
```

### Backend Setup 
```bash
cd Backend
npm install
npm run dev
```

### Environment Variables
create a .env file in the backend directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```
