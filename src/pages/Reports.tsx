import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { BarChart3, PieChart, TrendingUp, Download, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
}

interface Stats {
  total: number;
  present: number;
  late: number;
  absent: number;
  early_departure: number;
  totalEmployees: number;
}

interface DepartmentStat {
  id: string;
  name: string;
  total_employees: number;
  present: number;
  late: number;
  absent: number;
}

interface EmployeeReport {
  employee: Employee;
  attendance: any[];
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('attendance');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [department, setDepartment] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [employeeReport, setEmployeeReport] = useState<EmployeeReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Summary', icon: BarChart3 },
    { value: 'department', label: 'Department Analysis', icon: PieChart },
    { value: 'trends', label: 'Attendance Trends', icon: TrendingUp },
    { value: 'individual', label: 'Individual Reports', icon: FileText },
  ];

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (reportType !== 'individual') {
      generateReport();
    }
  }, [reportType, dateRange, department, startDate, endDate]);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/departments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(['all', ...response.data.map((dept: any) => dept.name)]);
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

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch employees');
      toast({
        title: 'Error',
        description: 'Failed to fetch employees from backend.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDateRange = () => {
    const today = new Date();
    let calculatedStartDate: Date;
    switch (dateRange) {
      case 'today':
        calculatedStartDate = today;
        break;
      case 'week':
        calculatedStartDate = subWeeks(today, 1);
        break;
      case 'month':
        calculatedStartDate = subMonths(today, 1);
        break;
      case 'custom':
        calculatedStartDate = startDate || subMonths(today, 1);
        break;
      default:
        calculatedStartDate = subMonths(today, 1);
    }
    return {
      startDate: format(calculatedStartDate, 'yyyy-MM-dd'),
      endDate: format(endDate || today, 'yyyy-MM-dd'),
    };
  };

  const generateReport = async () => {
    setIsLoading(true);
    setError(null);
    const { startDate: start, endDate: end } = calculateDateRange();

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, params: { startDate: start, endDate: end } };

      if (reportType === 'attendance' || reportType === 'trends') {
        const response = await axios.get('http://localhost:3000/api/reports/attendance', config);
        const employeeCountResponse = await axios.get('http://localhost:3000/api/employees/count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          ...response.data.stats,
          totalEmployees: employeeCountResponse.data.count,
        });
      } else if (reportType === 'department') {
        const response = await axios.get('http://localhost:3000/api/reports/departments', config);
        setDepartmentStats(response.data);
      }

      toast({
        title: 'Report Generated',
        description: 'Report data loaded successfully.',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate report');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmployeeReport = async () => {
    if (!selectedEmployee) {
      toast({
        title: 'Error',
        description: 'Please select an employee.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    const { startDate: start, endDate: end } = calculateDateRange();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/reports/employee/${selectedEmployee}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate: start, endDate: end },
      });
      setEmployeeReport(response.data);
      toast({
        title: 'Employee Report Generated',
        description: 'Individual employee report loaded successfully.',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate employee report');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to generate employee report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AttendanceSummaryReport: React.FC = () => (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-xs text-gray-500">
                  {stats.totalEmployees ? ((stats.present / stats.totalEmployees) * 100).toFixed(1) : '0'}% attendance rate
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                <p className="text-sm text-gray-600">Late Arrivals</p>
                <p className="text-xs text-gray-500">
                  {stats.totalEmployees ? ((stats.late / stats.totalEmployees) * 100).toFixed(1) : '0'}% of total
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-xs text-gray-500">
                  {stats.totalEmployees ? ((stats.absent / stats.totalEmployees) * 100).toFixed(1) : '0'}% absence rate
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-xs text-gray-500">Active staff members</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Chart visualization would appear here</p>
              <p className="text-sm">Integration with charting library needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DepartmentAnalysisReport: React.FC = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departmentStats.map((dept) => (
          <Card key={dept.id}>
            <CardHeader>
              <CardTitle className="text-lg">{dept.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Present:</span>
                  <span className="font-medium text-green-600">{dept.present}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Late:</span>
                  <span className="font-medium text-yellow-600">{dept.late}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Absent:</span>
                  <span className="font-medium text-red-600">{dept.absent}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Attendance Rate:</span>
                  <span className="font-bold">
                    {dept.total_employees ? ((dept.present / dept.total_employees) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Department Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <PieChart className="h-12 w-12 mx-auto mb-2" />
            <p>Department comparison chart would appear here</p>
            <p className="text-sm">Pie chart showing attendance by department</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TrendsReport: React.FC = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Attendance trends over time</p>
              <p className="text-sm">Line chart showing attendance patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>8:00 AM - 9:00 AM</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>9:00 AM - 10:00 AM</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-sm">92%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>10:00 AM - 11:00 AM</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-sm">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                <div key={day} className="flex justify-between items-center">
                  <span>{day}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${88 - index * 2}%` }}
                      />
                    </div>
                    <span className="text-sm">{88 - index * 2}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const IndividualReport: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle>Individual Employee Reports</CardTitle>
        <CardDescription>Generate detailed reports for specific employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {`${emp.first_name} ${emp.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full" onClick={generateEmployeeReport} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Individual Report'}
          </Button>
        </div>
        {employeeReport && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">
              Employee: {employeeReport.employee.first_name} {employeeReport.employee.last_name}
            </h3>
            <div className="space-y-2">
              <p>Total Attendance Records: {employeeReport.attendance.length}</p>
              <p>Present: {employeeReport.attendance.filter((a: any) => a.status === 'present').length}</p>
              <p>Late: {employeeReport.attendance.filter((a: any) => a.status === 'late').length}</p>
              <p>Absent: {employeeReport.attendance.filter((a: any) => a.status === 'absent').length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderReport = () => {
    switch (reportType) {
      case 'attendance':
        return <AttendanceSummaryReport />;
      case 'department':
        return <DepartmentAnalysisReport />;
      case 'trends':
        return <TrendsReport />;
      case 'individual':
        return <IndividualReport />;
      default:
        return <AttendanceSummaryReport />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500">Generate and analyze attendance reports</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {isLoading && !stats && !departmentStats && !employeeReport && (
        <div className="text-center py-10">Loading report data...</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={reportType} onValueChange={setReportType} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {dateRange === 'custom' ? (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn('justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Start Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn('justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'End Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <div />
            )}

            <Select value={department} onValueChange={setDepartment} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={reportType === 'individual' ? generateEmployeeReport : generateReport}
              disabled={isLoading}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>

            <Button variant="outline" disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {renderReport()}
    </div>
  );
};

export default Reports;