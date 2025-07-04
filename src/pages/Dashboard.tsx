import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, TrendingUp, Building2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Stats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  totalDepartments: number;
  totalUnits: number;
}

interface AttendanceRecord {
  id: string;
  employeeName: string;
  department: string;
  unit: string | null;
  clockIn: string | null;
  clockOut: string | null;
  status: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    totalDepartments: 0,
    totalUnits: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch stats and recent attendance on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch employee stats
        const employeeStatsResponse = await axios.get('http://localhost:3000/api/employees/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch attendance stats
        const attendanceStatsResponse = await axios.get('http://localhost:3000/api/attendance/stats', {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] },
        });

        // Fetch departments and units
        const departmentsResponse = await axios.get('http://localhost:3000/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch recent attendance records (last 5)
        const attendanceResponse = await axios.get('http://localhost:3000/api/attendance', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5 },
        });

        // Calculate total units from departments response
        const totalUnits = departmentsResponse.data.reduce((sum: number, dept: any) => sum + (dept.unitsCount || 0), 0);

        // Set stats
        setStats({
          totalEmployees: employeeStatsResponse.data.totalEmployees || 0,
          presentToday: attendanceStatsResponse.data.present || 0,
          absentToday: attendanceStatsResponse.data.absent || 0,
          lateToday: attendanceStatsResponse.data.late || 0,
          totalDepartments: departmentsResponse.data.length || 0,
          totalUnits,
        });

        // Format attendance records
        const formattedAttendance = attendanceResponse.data.map((record: any) => ({
          id: record.id,
          employeeName: record.fullName || `${record.first_name} ${record.last_name}`,
          department: record.department_name || 'Unknown',
          unit: record.unit_name || null,
          clockIn: record.clock_in,
          clockOut: record.clock_out,
          status: record.status,
        }));

        setRecentAttendance(formattedAttendance);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to load dashboard data.');
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to load dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

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
      early_departure: 'bg-orange-100 text-orange-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of hospital attendance management</p>
      </div>

      {isLoading && <div className="text-center py-4">Loading dashboard data...</div>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
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
              description={`${stats.totalEmployees > 0 ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(1) : 0}% attendance rate`}
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
                  {recentAttendance.length === 0 && (
                    <p className="text-sm text-gray-500">No recent attendance records available.</p>
                  )}
                  {recentAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-gray-500">
                          {record.department}
                          {record.unit ? ` - ${record.unit}` : ''}
                        </p>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;