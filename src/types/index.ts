
export interface User {
  id: string;
  empNo?: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  gender: 'male' | 'female';
  dob: string;
  mobile: string;
  telephone?: string;
  bankName?: string;
  accountNo?: string;
  highestQualification: string;
  department: string;
  unit?: string;
  position: string;
  address: string;
  country: string;
  startDate: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  childrenNo: number;
  bio?: string;
  profile?: string;
  fingerprint?: string;
  activation: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  workHours: string;
  room: string;
  description: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  departmentId: string;
  headOfUnit?: string;
  description?: string;
}

export interface Position {
  id: string;
  title: string;
  salary: string;
  department: string;
}

export interface Qualification {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  unit?: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'early_departure';
  notes?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  totalDepartments: number;
  totalUnits: number;
}
