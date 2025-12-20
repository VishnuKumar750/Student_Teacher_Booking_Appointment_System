"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Fake Departments
const departments = ["Science", "Mathematics", "Commerce", "Arts", "Computer Science"];

// Fake Subjects
const subjects = {
  Science: ["Physics", "Chemistry", "Biology"],
  Mathematics: ["Algebra", "Geometry", "Calculus"],
  Commerce: ["Accountancy", "Economics", "Business Studies"],
  Arts: ["History", "Political Science", "Sociology"],
  "Computer Science": ["Programming", "Data Structures", "Operating Systems"],
};

export default function AddTeacherForm() {
  const [department, setDepartment] = useState("");

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-7xl bg-white/70  space-y-10">

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-800  mb-2">
          Add New Teacher
        </h2>
        <p className=" text-gray-500 text-sm">
          Please fill the details below to register a new teacher in the system.
        </p>

        {/* ------------------ PERSONAL INFORMATION ------------------ */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher Name */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700">Teacher Name</Label>
              <Input placeholder="Enter full name" className="rounded-xl" />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700">Email</Label>
              <Input type="email" placeholder="Enter email" className="rounded-xl" />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700">Phone Number</Label>
              <Input type="number" placeholder="Enter phone number" className="rounded-xl" />
            </div>

            {/* Address */}
            <div className="flex flex-col space-y-2 md:col-span-2">
              <Label className="text-gray-700">Address</Label>
              <Input placeholder="Enter full address" className="rounded-xl" />
            </div>
          </div>
        </div>

        {/* ------------------ ACADEMIC INFORMATION ------------------ */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">
            Academic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Department */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700">Department</Label>
              <Select onValueChange={setDepartment}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dep, i) => (
                    <SelectItem key={i} value={dep}>
                      {dep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700">Subject</Label>
              <Select disabled={!department}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {department &&
                    subjects[department].map((sub, i) => (
                      <SelectItem key={i} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Qualification */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700">Qualification</Label>
              <Input placeholder="e.g. M.Sc, PhD" className="rounded-xl" />
            </div>

            {/* Experience */}
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700">Experience (Years)</Label>
              <Input type="number" placeholder="e.g. 5" className="rounded-xl" />
            </div>

          </div>
        </div>

        <div className="flex items-center justify-end">
          {/* ------------------ SUBMIT BUTTON ------------------ */}
          <Button className="w-full lg:w-xs rounded-xl text-md py-3 font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition">
            Add Teacher
          </Button>

        </div>

      </div>
    </div>
  );
}
