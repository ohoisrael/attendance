import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDepartments, mockPositions, mockQualifications } from '@/data/mockData';
import { User, Building2, FileText, Fingerprint } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const AddEmployee: React.FC = () => {
  const [formData, setFormData] = useState({
    empNo: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    telephone: '',
    gender: '',
    dob: '',
    department: '',
    unit: '',
    position: '',
    highestQualification: '',
    address: '',
    country: '',
    startDate: '',
    maritalStatus: '',
    childrenNo: 0,
    bankName: '',
    accountNo: '',
    bio: '',
    fingerprint: '',
  });

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const availableUnits = mockDepartments.find(d => d.name === selectedDepartment)?.units || [];

  const { token } = useAuth();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find department and unit IDs
    const departmentObj = mockDepartments.find(d => d.name === formData.department);
    const unitObj = departmentObj?.units.find(u => u.name === formData.unit);

    // Prepare payload for backend
    const payload = {
      empNo: formData.empNo,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      telephone: formData.telephone,
      gender: formData.gender,
      dob: formData.dob,
      departmentId: departmentObj?.id,
      unitId: unitObj?.id,
      position: formData.position,
      highestQualification: formData.highestQualification,
      address: formData.address,
      country: formData.country,
      startDate: formData.startDate,
      maritalStatus: formData.maritalStatus,
      childrenNo: formData.childrenNo,
      bankName: formData.bankName,
      accountNo: formData.accountNo,
      bio: formData.bio,
      fingerprintId: formData.fingerprint,
      // Add other fields as needed
    };

    try {
      await axios.post('http://localhost:3000/api/employees', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: "Employee Added Successfully",
        description: `${formData.firstName} ${formData.lastName} has been added to the system.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
        <p className="text-gray-500">Register a new hospital staff member</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Basic employee details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empNo">Employee Number *</Label>
                  <Input
                    id="empNo"
                    value={formData.empNo}
                    onChange={(e) => handleInputChange('empNo', e.target.value)}
                    placeholder="EMP001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@hospital.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Phone *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="+233 24 123 4567"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Telephone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+233 30 123 4567"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="childrenNo">Number of Children</Label>
                  <Input
                    id="childrenNo"
                    type="number"
                    min="0"
                    value={formData.childrenNo}
                    onChange={(e) => handleInputChange('childrenNo', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Full residential address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Ghana"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Professional Details
              </CardTitle>
              <CardDescription>Work-related information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => {
                    handleInputChange('department', value);
                    setSelectedDepartment(value);
                    handleInputChange('unit', ''); // Reset unit when department changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map(dept => (
                      <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleInputChange('unit', value)}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(unit => (
                      <SelectItem key={unit.id} value={unit.name}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="position">Position *</Label>
                <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPositions.map(pos => (
                      <SelectItem key={pos.id} value={pos.title}>{pos.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="highestQualification">Highest Qualification *</Label>
                <Select value={formData.highestQualification} onValueChange={(value) => handleInputChange('highestQualification', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockQualifications.map(qual => (
                      <SelectItem key={qual.id} value={qual.name}>{qual.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Eco Bank"
                />
              </div>

              <div>
                <Label htmlFor="accountNo">Account Number</Label>
                <Input
                  id="accountNo"
                  value={formData.accountNo}
                  onChange={(e) => handleInputChange('accountNo', e.target.value)}
                  placeholder="1234567890"
                />
              </div>

              <div>
                <Label htmlFor="fingerprint" className="flex items-center">
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Fingerprint ID
                </Label>
                <Input
                  id="fingerprint"
                  value={formData.fingerprint}
                  onChange={(e) => handleInputChange('fingerprint', e.target.value)}
                  placeholder="FP001234567890"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Additional Information
            </CardTitle>
            <CardDescription>Optional details and notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="bio">Biography/Notes</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Additional notes about the employee..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Add Employee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
