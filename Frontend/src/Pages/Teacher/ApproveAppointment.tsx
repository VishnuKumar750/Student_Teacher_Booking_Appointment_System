import { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import {
  CalendarDays,
  Check,
  X,
  Hourglass,
  User,
  Building,
  Book,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import UniversalTable from '@/components/TableComponent';
import type { TableColumn } from '@/components/TableComponent';
import LoaderComponent from '@/components/LoaderComponent';
import ErrorComponent from '@/components/ErrorComponent';

// Types
type Appointment = {
  id: number;
  student: string;
  department: string;
  course: string;
  date: string;
  time: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
};

const ApproveAppointment = () => {
  const [filter, setFilter] = useState('all');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // -----------------------------
  // API CALL SIMULATION
  // -----------------------------
  useEffect(() => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      try {
        // Simulated API response
        const dummyData: Appointment[] = [
          {
            id: 1,
            student: 'Amit Sharma',
            department: 'CSE',
            course: 'B.Tech',
            date: '2025-11-18',
            time: '10:30 AM',
            message: 'Need help with project guidance',
            status: 'pending',
          },
        ];

        setAppointments(dummyData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Unable to fetch appointments. Please try again.');
        setLoading(false);
      }
    }, 1500);
  }, []);

  // -----------------------------
  // DATE FILTER LOGIC
  // -----------------------------
  const filteredAppointments = useMemo(() => {
    if (!appointments.length) return [];

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (filter === 'today') return appointments.filter((a) => a.date === today);
    if (filter === 'tomorrow') return appointments.filter((a) => a.date === tomorrow);
    if (filter === 'yesterday') return appointments.filter((a) => a.date === yesterday);

    return appointments;
  }, [filter, appointments]);

  // -----------------------------
  // ACTION BUTTONS
  // -----------------------------
  const handleApprove = (id: number) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
  };

  const handleReject = (id: number) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
  };

  const renderActions = (a: Appointment) => (
    <div className="space-x-2">
      <Button
        onClick={() => handleApprove(a.id)}
        size="icon"
        variant="outline"
        disabled={a.status !== 'pending'}
      >
        <Check className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => handleReject(a.id)}
        size="icon"
        variant="destructive"
        disabled={a.status !== 'pending'}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  // -----------------------------
  // TABLE COLUMNS
  // -----------------------------
  const columns: TableColumn[] = [
    { key: 'student', label: 'Student', icon: User },
    { key: 'department', label: 'Dept', icon: Building },
    { key: 'course', label: 'Course', icon: Book },
    { key: 'date', label: 'Date', icon: Calendar },
    { key: 'time', label: 'Time', icon: Clock },
    { key: 'message', label: 'Message', icon: MessageSquare },
    {
      key: 'status',
      label: 'Status',
      icon: CheckCircle,
      render: (a: Appointment) => (
        <div className="flex items-center gap-1">
          {a.status === 'approved' && (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Approved
            </span>
          )}
          {a.status === 'rejected' && (
            <span className="text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" /> Rejected
            </span>
          )}
          {a.status === 'pending' && (
            <span className="text-yellow-600 flex items-center gap-1">
              <Hourglass className="w-4 h-4" /> Pending
            </span>
          )}
        </div>
      ),
    },
  ];

  const fetchData = () => {
    console.log('fetchData');
  };

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading) {
    return <LoaderComponent />;
  }

  // -----------------------------
  // ERROR UI
  // -----------------------------
  if (error) {
    return <ErrorComponent message={error} onRetry={() => fetchData()} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Heading */}
      <div className="my-12">
        <h1 className="text-2xl font-semibold">Approve Appointments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review all student appointment requests and take action.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-medium flex items-center gap-1">
          <CalendarDays className="w-4 h-4" /> Filter by Date:
        </label>

        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-[200px] flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <UniversalTable
          columns={columns}
          data={filteredAppointments}
          actions={renderActions}
          emptyMessage="No appointments found"
        />
      </div>
    </div>
  );
};

export default ApproveAppointment;
