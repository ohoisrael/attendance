
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockDepartments } from '@/data/mockData';
import { Unit, Department } from '@/types';

const Units: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit & { departmentName?: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    headOfUnit: '',
    description: ''
  });

  // Get all units from all departments
  const allUnits = departments.flatMap(dept => 
    dept.units.map(unit => ({ ...unit, departmentName: dept.name }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUnit) {
      // Update existing unit
      setDepartments(departments.map(dept => ({
        ...dept,
        units: dept.units.map(unit => 
          unit.id === editingUnit.id 
            ? { ...formData, id: unit.id }
            : unit
        )
      })));
      setEditingUnit(null);
    } else {
      // Add new unit
      const newUnit: Unit = {
        id: (allUnits.length + 1).toString(),
        ...formData
      };
      
      setDepartments(departments.map(dept => 
        dept.id === formData.departmentId 
          ? { ...dept, units: [...dept.units, newUnit] }
          : dept
      ));
    }
    
    setFormData({ name: '', departmentId: '', headOfUnit: '', description: '' });
    setIsAddDialogOpen(false);
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

  const handleDelete = (unitId: string) => {
    setDepartments(departments.map(dept => ({
      ...dept,
      units: dept.units.filter(unit => unit.id !== unitId)
    })));
  };

  const resetForm = () => {
    setFormData({ name: '', departmentId: '', headOfUnit: '', description: '' });
    setEditingUnit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Units</h1>
          <p className="text-gray-500">Manage hospital units within departments</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Unit Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                  required
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
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the unit"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingUnit ? 'Update Unit' : 'Create Unit'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allUnits.map((unit) => (
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
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(unit.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
