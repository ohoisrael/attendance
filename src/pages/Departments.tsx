
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockDepartments } from '@/data/mockData';
import { Department } from '@/types';

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    workHours: '',
    room: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDepartment) {
      // Update existing department
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...dept, ...formData, units: dept.units }
          : dept
      ));
      setEditingDepartment(null);
    } else {
      // Add new department
      const newDepartment: Department = {
        id: (departments.length + 1).toString(),
        ...formData,
        units: []
      };
      setDepartments([...departments, newDepartment]);
    }
    
    setFormData({ name: '', workHours: '', room: '', description: '' });
    setIsAddDialogOpen(false);
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

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const resetForm = () => {
    setFormData({ name: '', workHours: '', room: '', description: '' });
    setEditingDepartment(null);
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
            <Button>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
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
                />
              </div>
              <Button type="submit" className="w-full">
                {editingDepartment ? 'Update Department' : 'Create Department'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(department.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
