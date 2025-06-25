
import { User, Department, Unit, Position, Qualification, AttendanceRecord, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    empNo: 'EMP001',
    username: 'admin',
    firstName: 'Vincent',
    lastName: 'Ayorinde',
    fullName: 'Vincent O. Ayorinde',
    email: 'admin@hospital.com',
    role: 'admin',
    gender: 'male',
    dob: '1985-11-01',
    mobile: '0240652816',
    telephone: '0305842411',
    bankName: 'Eco Bank',
    accountNo: 'ECO000111321',
    highestQualification: 'Masters of Science',
    department: 'Administration',
    unit: 'IT Management',
    position: 'System Administrator',
    address: 'P.O.Box Tema 9890',
    country: 'Ghana',
    startDate: '2015-03-04',
    maritalStatus: 'single',
    childrenNo: 0,
    bio: 'System Administrator with extensive experience in healthcare IT.',
    fingerprint: 'FP001234567890',
    activation: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    empNo: 'EMP002',
    username: 'patricia.nurse',
    firstName: 'Patricia',
    lastName: 'Woode',
    fullName: 'Patricia Woode Morison',
    email: 'patricia@hospital.com',
    role: 'employee',
    gender: 'female',
    dob: '1978-05-12',
    mobile: '0245545554',
    telephone: '0304554344',
    bankName: 'Barclays Bank',
    accountNo: '55544445555566',
    highestQualification: 'Bachelor of Nursing',
    department: 'Emergency Department',
    unit: 'Emergency Room',
    position: 'Senior Nurse',
    address: 'Accra Osu',
    country: 'Ghana',
    startDate: '2015-03-13',
    maritalStatus: 'married',
    childrenNo: 2,
    bio: 'Experienced emergency room nurse with 10+ years in critical care.',
    fingerprint: 'FP001234567891',
    activation: true,
    createdAt: new Date().toISOString(),
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Emergency Department',
    workHours: '24/7',
    room: 'Ground Floor - East Wing',
    description: 'Handles emergency medical cases and critical care',
    units: [
      { id: '1', name: 'Emergency Room', departmentId: '1', headOfUnit: 'Dr. Smith', description: 'Main emergency treatment area' },
      { id: '2', name: 'Trauma Unit', departmentId: '1', headOfUnit: 'Dr. Johnson', description: 'Specialized trauma care' },
      { id: '3', name: 'Observation Unit', departmentId: '1', headOfUnit: 'Nurse Patricia', description: 'Patient observation and monitoring' }
    ]
  },
  {
    id: '2',
    name: 'Surgery Department',
    workHours: '6:00 AM - 10:00 PM',
    room: '3rd Floor - Central Wing',
    description: 'Surgical procedures and operating theaters',
    units: [
      { id: '4', name: 'Operating Theater 1', departmentId: '2', headOfUnit: 'Dr. Williams', description: 'General surgery operations' },
      { id: '5', name: 'Operating Theater 2', departmentId: '2', headOfUnit: 'Dr. Brown', description: 'Specialized surgical procedures' },
      { id: '6', name: 'Recovery Room', departmentId: '2', headOfUnit: 'Nurse Mary', description: 'Post-surgery patient recovery' }
    ]
  },
  {
    id: '3',
    name: 'Administration',
    workHours: '8:00 AM - 5:00 PM',
    room: '1st Floor - West Wing',
    description: 'Hospital administration and management',
    units: [
      { id: '7', name: 'Human Resources', departmentId: '3', headOfUnit: 'HR Manager', description: 'Staff management and recruitment' },
      { id: '8', name: 'IT Management', departmentId: '3', headOfUnit: 'IT Director', description: 'Technology and systems management' },
      { id: '9', name: 'Finance', departmentId: '3', headOfUnit: 'Finance Manager', description: 'Financial operations and accounting' }
    ]
  }
];

export const mockPositions: Position[] = [
  { id: '1', title: 'System Administrator', salary: 'GHC 6,000', department: 'Administration' },
  { id: '2', title: 'Senior Nurse', salary: 'GHC 4,500', department: 'Emergency Department' },
  { id: '3', title: 'Surgeon', salary: 'GHC 15,000', department: 'Surgery Department' },
  { id: '4', title: 'HR Manager', salary: 'GHC 8,000', department: 'Administration' },
  { id: '5', title: 'Emergency Physician', salary: 'GHC 12,000', department: 'Emergency Department' }
];

export const mockQualifications: Qualification[] = [
  { id: '1', name: 'Bachelor of Science' },
  { id: '2', name: 'Masters of Science' },
  { id: '3', name: 'Bachelor of Nursing' },
  { id: '4', name: 'Masters of Nursing' },
  { id: '5', name: 'Doctor of Medicine' },
  { id: '6', name: 'PhD' },
  { id: '7', name: 'Professional Certificate' }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Vincent O. Ayorinde',
    department: 'Administration',
    unit: 'IT Management',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:00',
    clockOut: '17:00',
    hoursWorked: 9,
    status: 'present',
    notes: 'Regular working day'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Patricia Woode Morison',
    department: 'Emergency Department',
    unit: 'Emergency Room',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:30',
    status: 'late',
    notes: 'Traffic delay'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 145,
  presentToday: 132,
  absentToday: 8,
  lateToday: 5,
  totalDepartments: 12,
  totalUnits: 35
};
