"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";


// ------------------ FAKE DATA ------------------ //
const initialStudents = [
  {
    id: 1,
    name: "Aman Singh",
    email: "aman@gmail.com",
    department: "CSE",
    course: "B.Tech",
    phone: "9876543210",
    address: "Delhi",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    department: "IT",
    course: "BCA",
    phone: "9123456780",
    address: "Mumbai",
  },
  {
    id: 3,
    name: "Rohit Verma",
    email: "rohit@gmail.com",
    department: "CSE",
    course: "MCA",
    phone: "8989767565",
    address: "Jaipur",
  },
  {
    id: 4,
    name: "Neha Patel",
    email: "neha@gmail.com",
    department: "ECE",
    course: "B.Tech",
    phone: "9004521234",
    address: "Ahmedabad",
  },
];

const departments = ["CSE", "IT", "ECE", "ME"];
const courses = ["B.Tech", "BCA", "MCA", "Diploma"];

// ------------------------------------------------ //

export default function ViewStudents() {
  const [students, setStudents] = useState(initialStudents);

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);

  // ------------------ FILTERING ------------------ //
  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedDept || s.department === selectedDept) &&
      (!selectedCourse || s.course === selectedCourse)
    );
  });

  // ------------------ UPDATE STUDENT ------------------ //
  const handleUpdateStudent = () => {
    setStudents((prev) =>
      prev.map((s) => (s.id === editStudent.id ? editStudent : s))
    );
    console.log("Updated Student:", editStudent);
    setEditStudent(null);
  };

  // ------------------ DELETE STUDENT ------------------ //
  const handleDeleteStudent = () => {
    setStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
    console.log("Deleted Student:", deleteStudent);
    setDeleteStudent(null);
  };

  return (
    <div className="p-6 space-y-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">Students Records</h1>

      {/* 🔍 SEARCH + FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
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
                {courses.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

      </div>


      {/* 📋 STUDENTS TABLE */}
      <div className="border rounded-xl p-4 shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dept</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.address}</TableCell>

                <TableCell className="text-right flex gap-2 justify-end">

                  {/* EDIT BUTTON */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditStudent({ ...student })}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>

                    {editStudent && editStudent.id === student.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Student Details</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">

                          {/* Name */}
                          <div className="flex flex-col gap-2">
                            <Label>Name</Label>
                            <Input
                              value={editStudent.name}
                              onChange={(e) =>
                                setEditStudent({
                                  ...editStudent,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Email */}
                          <div className="flex flex-col gap-2">
                            <Label>Email</Label>
                            <Input
                              value={editStudent.email}
                              onChange={(e) =>
                                setEditStudent({
                                  ...editStudent,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Department */}
                          <div className="flex flex-col gap-2">
                            <Label>Department</Label>
                            <Select
                              value={editStudent.department}
                              onValueChange={(value) =>
                                setEditStudent({ ...editStudent, department: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Course */}
                          <div className="flex flex-col gap-2">
                            <Label>Course</Label>
                            <Select
                              value={editStudent.course}
                              onValueChange={(value) =>
                                setEditStudent({ ...editStudent, course: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {courses.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Phone */}
                          <div className="flex flex-col gap-2">
                            <Label>Phone No.</Label>
                            <Input
                              value={editStudent.phone}
                              onChange={(e) =>
                                setEditStudent({
                                  ...editStudent,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Address */}
                          <div className="flex flex-col gap-2">
                            <Label>Address</Label>
                            <Input
                              value={editStudent.address}
                              onChange={(e) =>
                                setEditStudent({
                                  ...editStudent,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>

                        </div>

                        <DialogFooter>
                          <Button onClick={handleUpdateStudent}>Update</Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>

                  {/* DELETE BUTTON */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteStudent(student)}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>

                    {deleteStudent && deleteStudent.id === student.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Delete</DialogTitle>
                        </DialogHeader>

                        <p className="text-gray-600">
                          Are you sure you want to delete{" "}
                          <span className="font-semibold">
                            {deleteStudent.name}
                          </span>
                          ?
                        </p>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteStudent(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteStudent}
                          >                                                                                                                                                                 
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredStudents.length === 0 && (
          <p className="text-center py-6 text-gray-500">No students found.</p>
        )}
      </div>
    </div>
  );
}
