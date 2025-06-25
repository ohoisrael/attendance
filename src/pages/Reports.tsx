
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart3, PieChart, TrendingUp, Download, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { mockAttendanceRecords, mockDashboardStats } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('attendance');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [department, setDepartment] = useState<string>('all');

  const stats = mockDashboardStats;
  const departments = ['Emergency Department', 'Surgery Department', 'Administration'];

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Summary', icon: BarChart3 },
    { value: 'department', label: 'Department Analysis', icon: PieChart },
    { value: 'trends', label: 'Attendance Trends', icon: TrendingUp },
    { value: 'individual', label: 'Individual Reports', icon: FileText }
  ];

  const generateReport = () => {
    console.log('Generating report...', { reportType, dateRange, department });
    // This would typically make an API call to generate the report
  };

  const AttendanceSummaryReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-xs text-gray-500">
                {((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% attendance rate
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.lateToday}</p>
              <p className="text-sm text-gray-600">Late Arrivals</p>
              <p className="text-xs text-gray-500">
                {((stats.lateToday / stats.totalEmployees) * 100).toFixed(1)}% of total
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-xs text-gray-500">
                {((stats.absentToday / stats.totalEmployees) * 100).toFixed(1)}% absence rate
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

      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Trend</CardTitle>
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

  const DepartmentAnalysisReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map((dept, index) => (
          <Card key={dept}>
            <CardHeader>
              <CardTitle className="text-lg">{dept}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Present:</span>
                  <span className="font-medium text-green-600">{45 - index * 5}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Late:</span>
                  <span className="font-medium text-yellow-600">{2 + index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Absent:</span>
                  <span className="font-medium text-red-600">{3 + index}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Attendance Rate:</span>
                  <span className="font-bold">{(90 - index * 2).toFixed(1)}%</span>
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
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p>Department comparison chart would appear here</p>
              <p className="text-sm">Pie chart showing attendance by department</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TrendsReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Trends</CardTitle>
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
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>9:00 AM - 10:00 AM</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm">92%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>10:00 AM - 11:00 AM</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
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
                      ></div>
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

  const IndividualReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Individual Employee Reports</CardTitle>
        <CardDescription>Generate detailed reports for specific employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emp1">Vincent O. Ayorinde</SelectItem>
              <SelectItem value="emp2">Patricia Woode Morison</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full">Generate Individual Report</Button>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Individual reports will include detailed attendance history, 
            punctuality analysis, and performance metrics for the selected employee.
          </p>
        </div>
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

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
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

            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
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

            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={generateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate
            </Button>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {renderReport()}
    </div>
  );
};

export default Reports;
