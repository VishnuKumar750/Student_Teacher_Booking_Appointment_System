import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-background">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your academic interactions and activities.
        </p>
      </div>

      {/* KEY METRICS - FULL WIDTH, TALLER CARDS */}
      <div
        className="
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-6 
        mb-10
      "
      >
        {/* Total Appointments */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2">
            <CardTitle className="text-muted-foreground text-sm">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2">
            <CardTitle className="text-muted-foreground text-sm">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">3</p>
          </CardContent>
        </Card>

        {/* Completed Meetings */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2">
            <CardTitle className="text-muted-foreground text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">7</p>
          </CardContent>
        </Card>

        {/* Cancelled */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2">
            <CardTitle className="text-muted-foreground text-sm">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-500">2</p>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM SECTION - MORE HEIGHT, FULL WIDTH */}
      <div
        className="
        grid 
        grid-cols-1 
        lg:grid-cols-2 
        gap-8
        pb-10
      "
      >
        {/* Appointment Progress */}
        <Card className="shadow-sm min-h-[260px]">
          <CardHeader>
            <CardTitle>Your Appointment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Completed vs Scheduled Appointments
            </p>

            <Progress value={70} className="h-3" />

            <p className="text-xs mt-3 text-muted-foreground">
              70% appointments completed this month
            </p>
          </CardContent>
        </Card>

        {/* Interaction Summary */}
        <Card className="shadow-sm min-h-[260px]">
          <CardHeader>
            <CardTitle>Interaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span>Most contacted department:</span>
                <span className="font-medium">Computer Science</span>
              </li>
              <li className="flex justify-between">
                <span>Most contacted teacher:</span>
                <span className="font-medium">Prof. Varun Mehta</span>
              </li>
              <li className="flex justify-between">
                <span>Average response time:</span>
                <span className="font-medium">4 hours</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
