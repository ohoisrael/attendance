import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Calendar as CalendarIcon, Filter, Download, Search, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AttendanceRecord } from '@/types';

const Attendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
    fetchAttendanceRecords();
  }, [selectedDate]);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data.map((dept: any) => dept.name));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch departments');
      toast({
        title: 'Error',
        description: 'Failed to fetch departments from backend.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      const response = await axios.get('http://localhost:3000/api/attendance', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: date,
          endDate: date
        }
      });
      setAttendanceRecords(response.data.map((record: any) => ({
        id: record.id,
        employeeName: `${record.first_name} ${record.last_name}`,
        employeeId: record.employee_id,
        department: record.department_name,
        unit: record.unit_name || '-',
        date: record.date,
        clockIn: record.clock_in || '-',
        clockOut: record.clock_out || '-',
        hoursWorked: record.hours_worked,
        status: record.status,
        notes: record.notes || '-'
      })));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch attendance records');
      toast({
        title: 'Error',
        description: 'Failed to fetch attendance records from backend.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      early_departure: 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  // Calculate stats
  const totalPresent = filteredRecords.filter(r => r.status === 'present').length;
  const totalLate = filteredRecords.filter(r => r.status === 'late').length;
  const totalAbsent = filteredRecords.filter(r => r.status === 'absent').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-500">Track and manage employee attendance records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Present</p>
                <p className="text-2xl font-bold text-green-600">{totalPresent}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late Arrivals</p>
                <p className="text-2xl font-bold text-yellow-600">{totalLate}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{totalAbsent}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">{filteredRecords.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="early_departure">Early Departure</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !attendanceRecords.length && (
            <div className="text-center py-10">Loading attendance records...</div>
          )}
          {error && !attendanceRecords.length && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.unit}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.clockIn}</TableCell>
                    <TableCell>{record.clockOut}</TableCell>
                    <TableCell>{record.hoursWorked ? `${record.hoursWorked}h` : '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(record.status)}>
                        {record.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;