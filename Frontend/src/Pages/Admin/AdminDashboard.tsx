import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, Blocks, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Students</CardTitle>
            <Users className="w-6 h-6" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">1,245</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Teachers</CardTitle>
            <GraduationCap className="w-6 h-6" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">82</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Courses</CardTitle>
            <BookOpen className="w-6 h-6" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">156</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Departments</CardTitle>
            <Blocks className="w-6 h-6" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">14</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Recent Student Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Course</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Aarav Sharma</td>
                    <td className="p-2">aarav@example.com</td>
                    <td className="p-2">Computer Science</td>
                    <td className="p-2">12 Nov 2025</td>
                  </tr>

                  <tr className="border-b">
                    <td className="p-2">Diya Verma</td>
                    <td className="p-2">diya@example.com</td>
                    <td className="p-2">Mechanical</td>
                    <td className="p-2">10 Nov 2025</td>
                  </tr>

                  <tr>
                    <td className="p-2">Kabir Singh</td>
                    <td className="p-2">kabir@example.com</td>
                    <td className="p-2">Electrical</td>
                    <td className="p-2">09 Nov 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List with Date Filter */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {/* Title */}
              <CardTitle>Appointments</CardTitle>

              {/* Date Filter Icon */}
              <div className="relative">
                <button
                  onClick={() => document.getElementById('dateFilter').showPicker()}
                  className="p-2 rounded hover:bg-gray-100 transition"
                >
                  <Calendar className="w-5 h-5" />
                </button>

                {/* Hidden Date Input */}
                <Input
                  id="dateFilter"
                  type="date"
                  className="absolute right-0 top-0 opacity-0 pointer-events-none"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2">Teacher</th>
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Department</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Dr. Mehta</td>
                    <td className="p-2">Aarav Sharma</td>
                    <td className="p-2">CSE</td>
                    <td className="p-2">15 Nov 2025</td>
                    <td className="p-2">2:00 PM</td>
                  </tr>

                  <tr className="border-b">
                    <td className="p-2">Prof. Kumar</td>
                    <td className="p-2">Diya Verma</td>
                    <td className="p-2">CSE</td>
                    <td className="p-2">15 Nov 2025</td>
                    <td className="p-2">4:30 PM</td>
                  </tr>

                  <tr>
                    <td className="p-2">Dr. Nisha</td>
                    <td className="p-2">Kabir Singh</td>
                    <td className="p-2">ECE</td>
                    <td className="p-2">16 Nov 2025</td>
                    <td className="p-2">11:00 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="pt-4 text-center text-sm text-gray-500">
        © 2025 Admin Panel — All Rights Reserved
      </div>
    </div>
  );
};

export default AdminDashboard;
