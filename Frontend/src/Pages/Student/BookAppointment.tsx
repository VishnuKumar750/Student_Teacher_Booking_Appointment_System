import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// -------------------------
// TEACHERS DATA (FAKE DATA)
// -------------------------
const teachersData = [
  {
    id: 1,
    name: 'Dr. Mohan Singh',
    department: 'CSE',
    course: 'B.Tech',
    subject: 'Data Structures',
  },
  {
    id: 2,
    name: 'Prof. Neha Sharma',
    department: 'CSE',
    course: 'M.Tech',
    subject: 'Machine Learning',
  },
  {
    id: 3,
    name: 'Dr. Rakesh Verma',
    department: 'ECE',
    course: 'B.Tech',
    subject: 'Digital Electronics',
  },
];

// -------------------------
// TIME SLOTS
// -------------------------
const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
];

// -------------------------
// ZOD SCHEMA
// -------------------------
const appointmentSchema = z.object({
  teacher: z.string().min(1, 'Select a teacher'),
  department: z.string().min(1),
  course: z.string().min(1),
  subject: z.string().min(1),
  date: z.string().nonempty('Date is required'),
  time: z.string().nonempty('Time is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const BookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
  });

  // ---------------------------------
  // API CALL FUNCTION
  // ---------------------------------
  const handleBookAppointment = async (data) => {
    try {
      setLoading(true);

      const res = await fetch('/api/student/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to book appointment');

      alert('Appointment booked successfully!');
      reset();
      setSelectedTeacher(null);
    } catch (err) {
      alert('Error booking appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------
  // SELECT TEACHER → AUTO FILL DETAILS
  // ---------------------------------
  const onTeacherSelect = (id) => {
    const teacher = teachersData.find((t) => t.id === Number(id));
    setSelectedTeacher(teacher);

    setValue('teacher', teacher.name);
    setValue('department', teacher.department);
    setValue('course', teacher.course);
    setValue('subject', teacher.subject);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 my-10">
      <h2 className="text-2xl font-semibold mb-2">Book an Appointment</h2>
      <p className="text-gray-600 mb-6">
        Select your teacher and choose your preferred date & time for the appointment.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit(handleBookAppointment)}>
        {/* TEACHER SELECT */}
        <div className="flex flex-col space-y-1">
          <Label>Teacher</Label>
          <Select onValueChange={onTeacherSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select Teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachersData.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.name} — {t.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teacher && <p className="text-red-500 text-sm">{errors.teacher.message}</p>}
        </div>

        {/* AUTO-FILLED FIELDS */}
        {selectedTeacher && (
          <>
            <div>
              <Label>Department</Label>
              <Input disabled value={selectedTeacher.department} />
            </div>

            <div>
              <Label>Course</Label>
              <Input disabled value={selectedTeacher.course} />
            </div>

            <div>
              <Label>Subject</Label>
              <Input disabled value={selectedTeacher.subject} />
            </div>
          </>
        )}

        {/* DATE */}
        <div className="flex flex-col space-y-1">
          <Label>Date</Label>
          <Input type="date" {...register('date')} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        {/* TIME */}
        <div className="flex flex-col space-y-1">
          <Label>Time</Label>
          <Select onValueChange={(val) => setValue('time', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
        </div>

        {/* MESSAGE */}
        <div className="flex flex-col space-y-1">
          <Label>Message / Reason</Label>
          <Textarea
            placeholder="Explain why you want to meet the teacher..."
            rows={4}
            {...register('message')}
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
        </div>

        {/* SUBMIT BUTTON */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </form>
    </div>
  );
};

export default BookAppointment;
