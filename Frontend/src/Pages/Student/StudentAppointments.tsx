import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Dummy Data
const dummyAppointments = [
  {
    id: 1,
    teacher: 'Dr. Mohan Singh',
    department: 'CSE',
    course: 'B.Tech',
    subject: 'Data Structures',
    date: '2025-11-20',
    time: '11:00 AM',
    status: 'approved',
    message: 'Need help with assignment',
  },
  {
    id: 2,
    teacher: 'Prof. Neha Sharma',
    department: 'CSE',
    course: 'M.Tech',
    subject: 'Machine Learning',
    date: '2025-11-22',
    time: '02:30 PM',
    status: 'pending',
    message: 'Clarification about project topic',
  },
  {
    id: 3,
    teacher: 'Dr. Rakesh Verma',
    department: 'ECE',
    course: 'B.Tech',
    subject: 'Digital Electronics',
    date: '2025-11-18',
    time: '10:00 AM',
    status: 'cancelled',
    message: 'Discussion on lab performance',
  },
];

const StudentAppointments = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Filter Logic
  const filteredAppointments = dummyAppointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' ? true : a.status === statusFilter;

    const matchesSearch =
      a.teacher.toLowerCase().includes(searchText.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchText.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600 text-white">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600 text-white">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="w-full p-6 my-10">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-2">My Appointments</h2>
      <p className="text-gray-600 mb-6">
        View all your booked appointments with teachers along with their status.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex flex-col space-y-1">
          <Label>Status</Label>
          <Select onValueChange={(val) => setStatusFilter(val)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex flex-col space-y-1">
          <Label>Search (Teacher / Subject)</Label>
          <Input
            placeholder="Search..."
            className="w-60"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Table Always Visible (Mobile + Desktop) */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="border-b bg-gray-100 text-left">
              <th className="p-3">Teacher</th>
              <th className="p-3">Department</th>
              <th className="p-3">Course</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Message</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{a.teacher}</td>
                  <td className="p-3">{a.department}</td>
                  <td className="p-3">{a.course}</td>
                  <td className="p-3">{a.subject}</td>
                  <td className="p-3">{a.date}</td>
                  <td className="p-3">{a.time}</td>
                  <td className="p-3">{getStatusBadge(a.status)}</td>
                  <td className="p-3">{a.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAppointments;
