"use client";

import { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  Select, SelectTrigger, SelectContent,
  SelectItem, SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";

import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { Pencil, Trash2 } from "lucide-react";

// Fake DB Filters
const fakeDepartments = ["Science", "Commerce", "Arts", "Computer Science"];
const fakeCourses = ["B.Tech", "BCA", "MCA", "B.Sc", "M.Sc"];
const fakeSubjects = ["Maths", "English", "Physics", "Biology", "Chemistry", "Programming"];

// Fake Teacher List
const initialTeachers = [
  { id: 1, name: "Kuldeep Singh", subject: "Maths", department: "Science", course: "B.Tech" },
  { id: 2, name: "Kavya Kumari", subject: "Biology", department: "Science", course: "B.Sc" },
  { id: 3, name: "Raghav Verma", subject: "English", department: "Arts", course: "B.A" },
  { id: 4, name: "Pooja Sharma", subject: "Physics", department: "Science", course: "M.Sc" },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(initialTeachers);

  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const [editTeacher, setEditTeacher] = useState(null);
  const [deleteTeacher, setDeleteTeacher] = useState(null);

  /* ----------------- FILTER LOGIC ----------------- */
  const filteredTeachers = teachers.filter((t) => {
    return (
      t.name.toLowerCase().includes(query.toLowerCase()) &&
      (departmentFilter ? t.department === departmentFilter : true) &&
      (courseFilter ? t.course === courseFilter : true) &&
      (subjectFilter ? t.subject === subjectFilter : true)
    );
  });

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-800  mb-4">
          View Teacher
        </h2>
      {/* ------------------ SEARCH + FILTERS ------------------ */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

  {/* SEARCH BAR */}
  <div className="relative w-full max-w-lg">
    <Label className="text-sm font-medium">Search Teacher</Label>
    <Input
      placeholder="Search teacher..."
      value={query}
      onFocus={() => setShowAutocomplete(true)}
      onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
      onChange={(e) => setQuery(e.target.value)}
      className="rounded-xl mt-1"
    />

    {showAutocomplete && query && (
      <div className="absolute mt-2 w-full z-20 rounded-xl border shadow-lg bg-white">
        <Command>
          <CommandInput value={query} />
          <CommandList>
            {filteredTeachers.length === 0 ? (
              <p className="p-2 text-sm text-gray-500">No results...</p>
            ) : (
              filteredTeachers.map((t) => (
                <CommandItem
                  key={t.id}
                  onSelect={() => setQuery(t.name)}
                  className="cursor-pointer"
                >
                  {t.name}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </div>
    )}
  </div>

  {/* FILTERS */}
  <div className="w-full lg:w-xl flex flex-wrap gap-3 ">

    {/* DEPARTMENT FILTER */}
    <div className="flex-1">
      <Label className="text-sm font-medium">Department</Label>
      <Select onValueChange={setDepartmentFilter}>
        <SelectTrigger className="rounded-xl mt-1">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          {fakeDepartments.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* COURSE FILTER */}
    <div className="flex-1">
      <Label className="text-sm font-medium">Course</Label>
      <Select onValueChange={setCourseFilter}>
        <SelectTrigger className="rounded-xl mt-1">
          <SelectValue placeholder="Select Course" />
        </SelectTrigger>
        <SelectContent>
          {fakeCourses.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* SUBJECT FILTER */}
    <div className="flex-1">
      <Label className="text-sm font-medium">Subject</Label>
      <Select onValueChange={setSubjectFilter}>
        <SelectTrigger className="rounded-xl mt-1">
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          {fakeSubjects.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

  </div>
</div>


      {/* ------------------ TEACHERS TABLE ------------------ */}
      <Card className="rounded-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Teachers List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>{teacher.course}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">

                    {/* EDIT BUTTON */}
                    <Button
                      variant="outline"
                      className="rounded-xl px-3"
                      onClick={() => setEditTeacher(teacher)}
                    >
                      <Pencil size={16} />
                    </Button>

                    {/* DELETE BUTTON */}
                    <Button
                      variant="destructive"
                      className="rounded-xl px-3"
                      onClick={() => setDeleteTeacher(teacher)}
                    >
                      <Trash2 size={16} />
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* ------------------ EDIT DIALOG ------------------ */}
      {editTeacher && (
        <Dialog open={true} onOpenChange={() => setEditTeacher(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editTeacher.name}
                  onChange={(e) =>
                    setEditTeacher({ ...editTeacher, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Department</Label>
                <Select
                  value={editTeacher.department}
                  onValueChange={(v) =>
                    setEditTeacher({ ...editTeacher, department: v })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fakeDepartments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Course</Label>
                <Select
                  value={editTeacher.course}
                  onValueChange={(v) =>
                    setEditTeacher({ ...editTeacher, course: v })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fakeCourses.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject</Label>
                <Select
                  value={editTeacher.subject}
                  onValueChange={(v) =>
                    setEditTeacher({ ...editTeacher, subject: v })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fakeSubjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setEditTeacher(null)} variant="outline">
                Cancel
              </Button>

              <Button
                onClick={() => {
                  setTeachers((prev) =>
                    prev.map((t) =>
                      t.id === editTeacher.id ? editTeacher : t
                    )
                  );
                  setEditTeacher(null);
                }}
              >
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ------------------ DELETE CONFIRM DIALOG ------------------ */}
      {deleteTeacher && (
        <Dialog open={true} onOpenChange={() => setDeleteTeacher(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Delete Teacher?</DialogTitle>
            </DialogHeader>

            <p className="text-sm">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTeacher.name}</span>?
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTeacher(null)}>
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  setTeachers((prev) =>
                    prev.filter((t) => t.id !== deleteTeacher.id)
                  );
                  setDeleteTeacher(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
