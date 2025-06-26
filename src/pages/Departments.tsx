import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Department } from '@/types';

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteDepartment, setDeleteDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    workHours: '',
    room: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        workHours: dept.work_hours,
        room: dept.room,
        description: dept.description,
        units: dept.units || []
      })));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingDepartment) {
        await axios.put(`http://localhost:3000/api/departments/${editingDepartment.id}`, {
          name: formData.name,
          workHours: formData.workHours,
          room: formData.room,
          description: formData.description
        }, config);
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id 
            ? { ...dept, ...formData }
            : dept
        ));
        toast({
          title: 'Department updated',
          description: 'Department details updated successfully.'
        });
        setEditingDepartment(null);
      } else {
        const response = await axios.post('http://localhost:3000/api/departments', {
          name: formData.name,
          workHours: formData.workHours,
          room: formData.room,
          description: formData.description
        }, config);
        const newDepartment: Department = {
          id: response.data.id,
          ...formData,
          units: []
        };
        setDepartments([...departments, newDepartment]);
        toast({
          title: 'Department created',
          description: 'New department added successfully.'
        });
      }

      setFormData({ name: '', workHours: '', room: '', description: '' });
      setIsAddDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save department');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to save department',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      workHours: department.workHours,
      room: department.room,
      description: department.description
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDepartment) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/departments/${deleteDepartment.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(departments.filter(dept => dept.id !== deleteDepartment.id));
      toast({
        title: 'Department deleted',
        description: 'Department has been removed.'
      });
      setDeleteDepartment(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete department');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to delete department',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', workHours: '', room: '', description: '' });
    setEditingDepartment(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500">Manage hospital departments and their units</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment 
                  ? 'Update the department information below.'
                  : 'Fill in the details to create a new department.'
                }
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="workHours">Work Hours</Label>
                <Input
                  id="workHours"
                  value={formData.workHours}
                  onChange={(e) => setFormData({ ...formData, workHours: e.target.value })}
                  placeholder="e.g., 8:00 AM - 5:00 PM"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="room">Room/Location</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="e.g., Ground Floor - East Wing"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the department"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : editingDepartment ? 'Update Department' : 'Create Department'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && !departments.length && (
        <div className="text-center py-10">Loading departments...</div>
      )}
      {error && !departments.length && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(department)}
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog open={deleteDepartment?.id === department.id} onOpenChange={open => setDeleteDepartment(open ? department : null)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {department.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDepartment(null)} disabled={isLoading}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 text-white">
                          {isLoading ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardDescription>{department.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {department.workHours}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {department.room}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Units</span>
                    <Badge variant="secondary">{department.units.length}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {department.units.slice(0, 3).map((unit) => (
                      <Badge key={unit.id} variant="outline" className="text-xs">
                        {unit.name}
                      </Badge>
                    ))}
                    {department.units.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{department.units.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Departments;