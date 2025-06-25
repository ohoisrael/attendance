
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  Clock, 
  BarChart3, 
  Settings, 
  UserPlus,
  FileSpreadsheet,
  Shield,
  Calendar,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole: 'admin' | 'hr' | 'employee';
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, isCollapsed }) => {
  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Building2, label: 'Departments', path: '/departments' },
    { icon: MapPin, label: 'Units', path: '/units' },
    { icon: Clock, label: 'Attendance', path: '/attendance' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: UserPlus, label: 'Add Employee', path: '/employees/add' },
    { icon: FileSpreadsheet, label: 'Import Excel', path: '/employees/import' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const hrMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Building2, label: 'Departments', path: '/departments' },
    { icon: Clock, label: 'Attendance', path: '/attendance' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: UserPlus, label: 'Add Employee', path: '/employees/add' },
    { icon: FileSpreadsheet, label: 'Import Excel', path: '/employees/import' },
  ];

  const employeeMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Clock, label: 'My Attendance', path: '/my-attendance' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Settings, label: 'Profile', path: '/profile' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return adminMenuItems;
      case 'hr':
        return hrMenuItems;
      case 'employee':
        return employeeMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={cn(
      "bg-slate-900 text-white h-screen transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">Hospital AMS</h1>
              <p className="text-xs text-slate-400">Attendance Management</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                    "hover:bg-slate-800",
                    isActive ? "bg-blue-600 text-white" : "text-slate-300"
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
