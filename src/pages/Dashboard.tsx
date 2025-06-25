
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, TrendingUp, Building2, MapPin, AlertCircle } from 'lucide-react';
import { mockDashboardStats, mockAttendanceRecords } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;
  const recentAttendance = mockAttendanceRecords.slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, description, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      early_departure: 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of hospital attendance management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          description="Active hospital staff"
          color="blue"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={Clock}
          description={`${((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% attendance rate`}
          color="green"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={AlertCircle}
          description="Staff members absent"
          color="red"
        />
        <StatCard
          title="Late Arrivals"
          value={stats.lateToday}
          icon={TrendingUp}
          description="Late clock-ins today"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Department Overview
            </CardTitle>
            <CardDescription>Hospital departments and units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Total Departments</p>
                  <p className="text-sm text-gray-500">Active departments</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalDepartments}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Total Units</p>
                  <p className="text-sm text-gray-500">Operational units</p>
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.totalUnits}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Attendance
            </CardTitle>
            <CardDescription>Latest attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{record.employeeName}</p>
                    <p className="text-sm text-gray-500">{record.department} - {record.unit}</p>
                    <p className="text-xs text-gray-400">
                      {record.clockIn && `In: ${record.clockIn}`}
                      {record.clockOut && ` | Out: ${record.clockOut}`}
                    </p>
                  </div>
                  <Badge className={getStatusBadge(record.status)}>
                    {record.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Add New Employee</h3>
              <p className="text-sm text-gray-500">Register a new staff member</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Clock className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">View Attendance</h3>
              <p className="text-sm text-gray-500">Check attendance records</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium">Generate Report</h3>
              <p className="text-sm text-gray-500">Create attendance reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
