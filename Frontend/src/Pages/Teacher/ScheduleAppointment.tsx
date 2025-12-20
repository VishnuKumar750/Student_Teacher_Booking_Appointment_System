import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, User, GraduationCap, MessageSquare, Building } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from '@/components/ui/command';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// -----------------------------
// ZOD VALIDATION
// -----------------------------
const appointmentSchema = z.object({
  student: z.string().min(1, 'Student is required'),
  department: z.string().min(1, 'Department is required'),
  course: z.string().min(1, 'Course is required'),
  date: z.string().nonempty('Date is required'),
  time: z.string().nonempty('Time is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Fake database
const studentsData = [
  { name: 'Amit Sharma', department: 'CSE', course: 'B.Tech' },
  { name: 'Priya Mehta', department: 'CSE', course: 'M.Tech' },
  { name: 'Rohan Verma', department: 'ECE', course: 'B.Tech' },
  { name: 'Sneha Bansal', department: 'MECH', course: 'Diploma' },
  { name: 'Ishaan Kapoor', department: 'CSE', course: 'Diploma' },
];

// Available time slots
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

const ScheduleAppointment = () => {
  const [openStudent, setOpenStudent] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
  });

  // Filter by department + course
  const filteredStudents = studentsData.filter(
    (s) => s.department === selectedDepartment && s.course === selectedCourse
  );

  // API call simulation
  const sendAppointmentData = async (data: any) => {
    console.log('Sending data:', data);
    alert('Appointment Scheduled Successfully!');
  };

  const onSubmit = (data: any) => sendAppointmentData(data);

  return (
    <div className="w-full min-h-screen py-16 px-4 flex justify-center bg-background">
      <div className="w-full max-w-3xl">
        {/* PAGE HEADING */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Schedule an Appointment</h1>
          <p className="text-gray-600 max-w-xl">
            Fill in the following details to schedule an appointment with a student. Select the
            department and course to filter students before choosing time and date.
          </p>
        </div>

        {/* MAIN FORM */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* DEPARTMENT + COURSE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Department */}
            <div className="flex flex-col space-y-1">
              <Label className="flex items-center gap-2">
                <Building className="w-4 h-4" /> Department
              </Label>

              <Select
                onValueChange={(val) => {
                  setSelectedDepartment(val);
                  setValue('department', val);
                  setValue('student', '');
                  setStudentSearch('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="MECH">MECH</SelectItem>
                  <SelectItem value="CIVIL">CIVIL</SelectItem>
                </SelectContent>
              </Select>

              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department.message}</p>
              )}
            </div>

            {/* Course */}
            <div className="flex flex-col space-y-1">
              <Label className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Course
              </Label>

              <Select
                onValueChange={(val) => {
                  setSelectedCourse(val);
                  setValue('course', val);
                  setValue('student', '');
                  setStudentSearch('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>

              {errors.course && <p className="text-red-500 text-sm">{errors.course.message}</p>}
            </div>
          </div>

          {/* STUDENT SELECTION */}
          {selectedDepartment && selectedCourse ? (
            <div className="flex flex-col space-y-1">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" /> Student
              </Label>

              <Popover open={openStudent} onOpenChange={setOpenStudent}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between w-full">
                    {studentSearch || 'Select Student'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-full">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No students found.</CommandEmpty>
                      <CommandGroup>
                        {filteredStudents.map((student) => (
                          <CommandItem
                            key={student.name}
                            onSelect={() => {
                              setValue('student', student.name);
                              setStudentSearch(student.name);
                              setOpenStudent(false);
                            }}
                          >
                            {student.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {errors.student && <p className="text-red-500 text-sm">{errors.student.message}</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Select department & course to view students.</p>
          )}

          {/* DATE */}
          <div className="flex flex-col space-y-1">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </Label>

            <Input type="date" {...register('date')} />
            {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
          </div>

          {/* TIME */}
          <div className="flex flex-col space-y-1">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Time
            </Label>

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
            <Label className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Message / Reason
            </Label>

            <Textarea
              rows={4}
              placeholder="Explain why the appointment is required..."
              {...register('message')}
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full">
            Schedule Appointment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleAppointment;
