import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Unit, Department } from '@/types';

const Units: React.FC = () => {
  const [units, setUnits] = useState<(Unit & { departmentName?: string })[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit & { departmentName?: string } | null>(null);
  const [deleteUnit, setDeleteUnit] = useState<Unit & { departmentName?: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    headOfUnit: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
    fetchUnits();
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

  const fetchUnits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/units', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnits(response.data.map((unit: any) => ({
        id: unit.id,
        name: unit.name,
        departmentId: unit.department_id,
        departmentName: unit.department_name,
        headOfUnit: unit.head_of_unit,
        description: unit.description
      })));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch units');
      toast({
        title: 'Error',
        description: 'Failed to fetch units from backend.',
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

      if (editingUnit) {
        await axios.put(`http://localhost:3000/api/units/${editingUnit.id}`, {
          name: formData.name,
          departmentId: formData.departmentId,
          headOfUnit: formData.headOfUnit,
          description: formData.description
        }, config);
        setUnits(units.map(unit => 
          unit.id === editingUnit.id 
            ? { ...unit, ...formData, departmentName: departments.find(dept => dept.id === formData.departmentId)?.name }
            : unit
        ));
        toast({
          title: 'Unit updated',
          description: 'Unit details updated successfully.'
        });
        setEditingUnit(null);
      } else {
        const response = await axios.post('http://localhost:3000/api/units', {
          name: formData.name,
          departmentId: formData.departmentId,
          headOfUnit: formData.headOfUnit,
          description: formData.description
        }, config);
        const newUnit = {
          id: response.data.id,
          ...formData,
          departmentName: departments.find(dept => dept.id === formData.departmentId)?.name
        };
        setUnits([...units, newUnit]);
        toast({
          title: 'Unit created',
          description: 'New unit added successfully.'
        });
      }

      setFormData({ name: '', departmentId: '', headOfUnit: '', description: '' });
      setIsAddDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save unit');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to save unit',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (unit: Unit & { departmentName?: string }) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      departmentId: unit.departmentId,
      headOfUnit: unit.headOfUnit || '',
      description: unit.description || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteUnit) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/units/${deleteUnit.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnits(units.filter(unit => unit.id !== deleteUnit.id));
      toast({
        title: 'Unit deleted',
        description: 'Unit has been removed.'
      });
      setDeleteUnit(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete unit');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to delete unit',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', departmentId: '', headOfUnit: '', description: '' });
    setEditingUnit(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Units</h1>
          <p className="text-gray-500">Manage hospital units innerhalb departments</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? 'Edit Unit' : 'Add New Unit'}
              </DialogTitle>
              <DialogDescription>
                {editingUnit 
                  ? 'Update the unit information below.'
                  : 'Fill in the details to create a new unit.'
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
                <Label htmlFor="name">Unit Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                  required
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
  <Label htmlFor="headOfUnit">Head of Unit</Label>
  <Input
    id="headOfUnit"
    value={formData.headOfUnit}
    onChange={(e) => setFormData({ ...formData, headOfUnit: e.target.value })}
    placeholder="e.g., Dr. Smith"
    disabled={isLoading}
  />
</div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the unit"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : editingUnit ? 'Update Unit' : 'Create Unit'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && !units.length && (
        <div className="text-center py-10">Loading units...</div>
      )}
      {error && !units.length && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <Card key={unit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{unit.name}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(unit)}
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog open={deleteUnit?.id === unit.id} onOpenChange={open => setDeleteUnit(open ? unit : null)}>
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
                        <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {unit.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteUnit(null)} disabled={isLoading}>
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
              <CardDescription>{unit.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Department:</span>
                  <Badge variant="outline" className="ml-2">
                    {unit.departmentName}
                  </Badge>
                </div>
                {unit.headOfUnit && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">Head:</span>
                    <span className="ml-1">{unit.headOfUnit}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Units;