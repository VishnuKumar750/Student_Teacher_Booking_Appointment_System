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

// Dummy Teachers Data
const teachers = [
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
  {
    id: 4,
    name: 'Dr. Priya Nair',
    department: 'IT',
    course: 'BCA',
    subject: 'Web Development',
  },
];

const SearchTeacher = () => {
  const [department, setDepartment] = useState('all');
  const [course, setCourse] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Filter Logic
  const filteredTeachers = teachers.filter((t) => {
    const matchDept = department === 'all' || t.department === department;
    const matchCourse = course === 'all' || t.course === course;

    const matchSearch =
      t.name.toLowerCase().includes(searchText.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchText.toLowerCase());

    return matchDept && matchCourse && matchSearch;
  });

  return (
    <div className="w-full p-6 my-10">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-2">Search Teachers</h2>
      <p className="text-gray-600 mb-6">Find teachers based on department, course, or subject.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Search */}
        <div className="flex flex-col space-y-1">
          <Label>Search (Name / Subject)</Label>
          <Input
            placeholder="Search..."
            className="w-60"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col space-y-1">
          <Label>Department</Label>
          <Select onValueChange={setDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course */}
        <div className="flex flex-col space-y-1">
          <Label>Course</Label>
          <Select onValueChange={setCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="B.Tech">B.Tech</SelectItem>
              <SelectItem value="M.Tech">M.Tech</SelectItem>
              <SelectItem value="BCA">BCA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="w-full overflow-x-auto ">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="border-b bg-gray-100 text-left">
              <th className="p-3">Teacher Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Course</th>
              <th className="p-3">Subject</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No teachers found
                </td>
              </tr>
            ) : (
              filteredTeachers.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.department}</td>
                  <td className="p-3">{t.course}</td>
                  <td className="p-3">{t.subject}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchTeacher;
