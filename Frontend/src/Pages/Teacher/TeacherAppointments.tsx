import { useState, useMemo, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import {
  User,
  Building,
  BookOpen,
  CalendarDays,
  Clock,
  MessageCircle,
  UserCheck,
  Search,
  ListFilter,
  ArrowUpDown,
  RefreshCcw,
} from 'lucide-react';

import type { TableColumn } from '@/components/TableComponent';
import UniversalTable from '@/components/TableComponent';

// 🔥 Import universal components
import LoaderComponent from '@/components/LoaderComponent';
import ErrorComponent from '@/components/ErrorComponent';

type Appointment = {
  id: number;
  student: string;
  department: string;
  course: string;
  date: string;
  time: string;
  message: string;
  createdBy: string;
};

type SearchKey = 'student' | 'department' | 'course';

const columns: TableColumn[] = [
  { key: 'student', label: 'Student', icon: User },
  { key: 'department', label: 'Dept', icon: Building },
  { key: 'course', label: 'Course', icon: BookOpen },
  { key: 'date', label: 'Date', icon: CalendarDays },
  { key: 'time', label: 'Time', icon: Clock },
  { key: 'message', label: 'Message', icon: MessageCircle },
  {
    key: 'createdBy',
    label: 'Scheduled By',
    icon: UserCheck,
    render: (item) => (
      <span className={item.createdBy === 'student' ? 'text-blue-600' : 'text-green-600'}>
        {item.createdBy === 'student' ? 'Student' : 'Teacher'}
      </span>
    ),
  },
];

const TeacherAppointments = () => {
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<SearchKey>('student');
  const [sort, setSort] = useState<'asc' | 'dsc'>('asc');

  // API states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const data: Appointment[] = [
        {
          id: 1,
          student: 'Amit Sharma',
          department: 'CSE',
          course: 'B.Tech',
          date: '2025-11-18',
          time: '10:30 AM',
          message: 'Need help with project guidance',
          createdBy: 'teacher',
        },
        {
          id: 2,
          student: 'Priya Mehta',
          department: 'ECE',
          course: 'M.Tech',
          date: '2025-11-19',
          time: '02:00 PM',
          message: 'Doubt in lab assignment',
          createdBy: 'student',
        },
        {
          id: 3,
          student: 'Rohan Verma',
          department: 'CSE',
          course: 'B.Tech',
          date: '2025-11-17',
          time: '11:15 AM',
          message: 'Discussion about project selection',
          createdBy: 'teacher',
        },
      ];

      setAppointments(data);
    } catch (err: any) {
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (search.trim() !== '') {
      result = result.filter((item) => item[searchBy].toLowerCase().includes(search.toLowerCase()));
    }

    result.sort((a, b) => {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return sort === 'asc' ? dA - dB : dB - dA;
    });

    return result;
  }, [search, searchBy, sort, appointments]);

  if (loading) {
    return <LoaderComponent />;
  }

  if (error) {
    return <ErrorComponent message={error} onRetry={fetchAppointments} />;
  }

  return (
    <div className="w-full space-y-6">
      <div className="my-12">
        <h1 className="text-2xl font-semibold">All Appointments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and track all scheduled appointments with search, sorting, and filters.
        </p>
      </div>

      {/* 🔥 UNIVERSAL LOADER */}
      <>
        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          {/* SEARCH */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              Search
            </label>

            <Input
              placeholder={`Search by ${searchBy}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-lg"
            />
          </div>

          {/* SEARCH BY */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-muted-foreground" />
              Search By
            </label>

            <Select onValueChange={(v) => setSearchBy(v as SearchKey)} defaultValue="student">
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Search By" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="course">Course</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SORT */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              Sort
            </label>

            <Select onValueChange={(v) => setSort(v as 'asc' | 'dsc')} defaultValue="asc">
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="asc">Date Ascending</SelectItem>
                <SelectItem value="dsc">Date Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-md border mt-4">
          <UniversalTable
            columns={columns}
            data={filteredAppointments}
            emptyMessage="No appointments found"
          />
        </div>
      </>
    </div>
  );
};

export default TeacherAppointments;
