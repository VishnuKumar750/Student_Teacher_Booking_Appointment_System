import React, { useEffect, useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Users,
  User,
} from 'lucide-react';

import LoaderComponent from '@/components/LoaderComponent';
import ErrorComponent from '@/components/ErrorComponent';

// ---------- TYPES ----------
type DashboardData = {
  scheduled: number;
  pending: number;
  completed: number;
  cancelled: number;

  upcomingAppointments: {
    id: number;
    name: string;
    date: string;
  }[];

  interactionSummary: {
    department: string;
    course: string;
    student: string;
    averageLoad: number;
  };
};

const TeacherDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---------- API CALL ----------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Simulated API data
      const response: DashboardData = {
        scheduled: 14,
        pending: 5,
        completed: 9,
        cancelled: 2,

        upcomingAppointments: [
          { id: 1, name: 'Rohan Singh', date: '20 Nov, 11:30 AM' },
          { id: 2, name: 'Aditi Sharma', date: '22 Nov, 2:00 PM' },
          { id: 3, name: 'Manish Kumar', date: '23 Nov, 10:00 AM' },
        ],

        interactionSummary: {
          department: 'Computer Science',
          course: 'B.Tech - 3rd Year',
          student: 'Rohan Singh',
          averageLoad: 6,
        },
      };

      setData(response);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Call on first load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ---------- LOADING ----------
  if (loading) {
    return <LoaderComponent label="Loading dashboard..." />;
  }

  // ---------- ERROR ----------
  if (error) {
    return <ErrorComponent message={error} onRetry={fetchDashboardData} />;
  }

  // UI STARTS BELOW (unchanged)
  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-background my-12 lg:my-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-primary" /> Teacher Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your schedule, appointments, and student interactions.
        </p>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Scheduled Appointments */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2 flex flex-row items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-muted-foreground text-sm">Scheduled Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{data?.scheduled}</p>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2 flex flex-row items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-muted-foreground text-sm">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{data?.pending}</p>
          </CardContent>
        </Card>

        {/* Completed Sessions */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2 flex flex-row items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-muted-foreground text-sm">Completed Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{data?.completed}</p>
          </CardContent>
        </Card>

        {/* Cancelled */}
        <Card className="shadow-sm h-32 flex flex-col justify-center">
          <CardHeader className="py-2 flex flex-row items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-muted-foreground text-sm">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{data?.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <Card className="shadow-sm min-h-[260px]">
          <CardHeader className="flex flex-row items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-muted-foreground" />
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              {data?.upcomingAppointments.map((apt) => (
                <li key={apt.id} className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {apt.name}
                  </span>
                  <span className="font-medium text-muted-foreground">{apt.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Interaction Summary */}
        <Card className="shadow-sm min-h-[260px]">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <CardTitle>Interaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span>Most contacted department:</span>
                <span className="font-medium">{data?.interactionSummary.department}</span>
              </li>
              <li className="flex justify-between">
                <span>Most active course:</span>
                <span className="font-medium">{data?.interactionSummary.course}</span>
              </li>
              <li className="flex justify-between">
                <span>Most frequent student:</span>
                <span className="font-medium">{data?.interactionSummary.student}</span>
              </li>
              <li className="flex justify-between">
                <span>Average appointment load/week:</span>
                <span className="font-medium">{data?.interactionSummary.averageLoad}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
