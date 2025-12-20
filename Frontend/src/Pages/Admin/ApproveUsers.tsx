import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const ApproveStudent = () => {
  const [students] = useState([
    { id: 1, name: 'Aman Singh', email: 'aman@gmail.com', department: 'CSE', course: 'B.Tech' },
    { id: 2, name: 'Priya Sharma', email: 'priya@gmail.com', department: 'IT', course: 'BCA' },
    { id: 3, name: 'Rohit Verma', email: 'rohit@gmail.com', department: 'CSE', course: 'MCA' },
    { id: 4, name: 'Neha Patel', email: 'neha@gmail.com', department: 'ECE', course: 'B.Tech' },
  ]);

  const [pending, setPending] = useState(students);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleApprove = (id) => {
    setPending(pending.filter((s) => s.id !== id));
  };

  const handleReject = (id) => {
    setPending(pending.filter((s) => s.id !== id));
  };

  const filteredStudents = pending.filter((student) => {
    return (
      student.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedDept ? student.department === selectedDept : true) &&
      (selectedCourse ? student.course === selectedCourse : true)
    );
  });

  return (
    <div className="p-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">Pending Student Approvals</h2>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <Label>Search Student</Label>
          <Input
            placeholder="Search student by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Department Filter */}
          <div className="flex flex-col gap-2">
            <Label>Department</Label>
            <Select onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="ME">ME</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Filter */}
          <div className="flex flex-col gap-2">
            <Label>Course</Label>
            <Select onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="BCA">BCA</SelectItem>
                <SelectItem value="MCA">MCA</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.course}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button variant="default" size="sm" onClick={() => handleApprove(student.id)}>
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(student.id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-6 text-muted-foreground">
                  No students match the search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApproveStudent;
