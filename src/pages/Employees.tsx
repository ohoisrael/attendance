import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewEmployee, setViewEmployee] = useState<any | null>(null);
  const [editEmployee, setEditEmployee] = useState<any | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/employees');
        setEmployees(res.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch employees from backend.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.empNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-red-100 text-red-800',
      hr: 'bg-blue-100 text-blue-800',
      employee: 'bg-green-100 text-green-800'
    };
    return variants[role as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  // Edit form handlers
  const handleEditInputChange = (field: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/employees/${editEmployee.id}`, editForm);
      toast({ title: 'Employee updated', description: 'Employee details updated successfully.' });
      setEditEmployee(null);
      setEditForm(null);
      // Refresh list
      const res = await axios.get('http://localhost:3000/api/employees');
      setEmployees(res.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update employee.', variant: 'destructive' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEmployee) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/employees/${deleteEmployee.id}`);
      toast({ title: 'Employee deleted', description: 'Employee has been removed.' });
      setDeleteEmployee(null);
      // Refresh list
      const res = await axios.get('http://localhost:3000/api/employees');
      setEmployees(res.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete employee.', variant: 'destructive' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-500">Manage hospital staff and their information</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link to="/employees/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, employee number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Total Employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {departments.length}
            </div>
            <p className="text-xs text-muted-foreground">Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {employees.filter(emp => emp.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">Administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {filteredEmployees.length} of {employees.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading employees...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={employee.profilePicture} />
                        <AvatarFallback>
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.fullName}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{employee.empNo}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.unit || 'N/A'}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(employee.role)}>
                        {employee.role ? employee.role.toUpperCase() : 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.isActive ? 'default' : 'secondary'}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* View */}
                        <Dialog open={viewEmployee?.id === employee.id} onOpenChange={open => setViewEmployee(open ? employee : null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Employee Details</DialogTitle>
                              <DialogDescription>View employee information</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                              <div><b>Name:</b> {employee.fullName}</div>
                              <div><b>Email:</b> {employee.email}</div>
                              <div><b>Department:</b> {employee.department}</div>
                              <div><b>Unit:</b> {employee.unit}</div>
                              <div><b>Position:</b> {employee.position}</div>
                              <div><b>Mobile:</b> {employee.mobile}</div>
                              <div><b>Gender:</b> {employee.gender}</div>
                              <div><b>DOB:</b> {employee.dob}</div>
                              <div><b>Address:</b> {employee.address}</div>
                              <div><b>Status:</b> {employee.isActive ? 'Active' : 'Inactive'}</div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => setViewEmployee(null)} type="button">Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {/* Edit */}
                        <Dialog open={editEmployee?.id === employee.id} onOpenChange={open => {
                          if (open) {
                            setEditEmployee(employee);
                            setEditForm({ ...employee });
                          } else {
                            setEditEmployee(null);
                            setEditForm(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Employee</DialogTitle>
                              <DialogDescription>Update employee information</DialogDescription>
                            </DialogHeader>
                            {editForm && (
                              <form onSubmit={handleEditSubmit} className="space-y-2">
                                <Input value={editForm.firstName} onChange={e => handleEditInputChange('firstName', e.target.value)} placeholder="First Name" required />
                                <Input value={editForm.lastName} onChange={e => handleEditInputChange('lastName', e.target.value)} placeholder="Last Name" required />
                                <Input value={editForm.email} onChange={e => handleEditInputChange('email', e.target.value)} placeholder="Email" required />
                                <Input value={editForm.mobile} onChange={e => handleEditInputChange('mobile', e.target.value)} placeholder="Mobile" required />
                                <Input value={editForm.position} onChange={e => handleEditInputChange('position', e.target.value)} placeholder="Position" required />
                                <Input value={editForm.department} onChange={e => handleEditInputChange('department', e.target.value)} placeholder="Department" required />
                                <Input value={editForm.unit} onChange={e => handleEditInputChange('unit', e.target.value)} placeholder="Unit" />
                                <Input value={editForm.address} onChange={e => handleEditInputChange('address', e.target.value)} placeholder="Address" required />
                                <DialogFooter>
                                  <Button type="button" variant="outline" onClick={() => setEditEmployee(null)}>Cancel</Button>
                                  <Button type="submit" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
                                </DialogFooter>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        {/* Delete */}
                        <AlertDialog open={deleteEmployee?.id === employee.id} onOpenChange={open => setDeleteEmployee(open ? employee : null)}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {employee.fullName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteEmployee(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} disabled={deleteLoading} className="bg-red-600 text-white">
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
