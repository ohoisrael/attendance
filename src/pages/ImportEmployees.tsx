import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface ImportedEmployee {
  empNo: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  telephone?: string;
  gender?: string;
  dob?: string;
  departmentId: number;
  unitId?: number;
  position: string;
  highestQualification?: string;
  address?: string;
  country?: string;
  startDate?: string;
  maritalStatus?: string;
  childrenNo?: number;
  bankName?: string;
  accountNo?: string;
  bio?: string;
  fingerprintId?: string;
  profilePicture?: string;
  role?: string;
  status: 'valid' | 'error';
  errors?: string[];
}

interface Department {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
  departmentId: number;
}

const ImportEmployees: React.FC = () => {
  const [importedData, setImportedData] = useState<ImportedEmployee[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch('http://localhost:3000/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const deptData = await deptResponse.json();
        setDepartments(deptData);

        // Fetch units
        const unitResponse = await fetch('http://localhost:3000/api/units', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unitData = await unitResponse.json();
        setUnits(unitData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch required data.',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, [token]);

  const validateEmployee = (employee: any): ImportedEmployee => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!employee.empNo) errors.push('Employee number is required');
    if (!employee.firstName) errors.push('First name is required');
    if (!employee.lastName) errors.push('Last name is required');
    if (!employee.email) errors.push('Email is required');
    if (!employee.mobile) errors.push('Mobile number is required');
    if (!employee.department) errors.push('Department is required');
    if (!employee.position) errors.push('Position is required');
    
    // Email format validation
    if (employee.email && !/\S+@\S+\.\S+/.test(employee.email)) {
      errors.push('Invalid email format');
    }

    // Department validation
    const department = departments.find(d => d.name === employee.department);
    if (employee.department && !department) {
      errors.push(`Department "${employee.department}" not found`);
    }

    // Unit validation if provided
    let unitId: number | undefined;
    if (employee.unit) {
      const unit = units.find(u => u.name === employee.unit && u.departmentId === department?.id);
      if (!unit) {
        errors.push(`Unit "${employee.unit}" not found in department "${employee.department}"`);
      } else {
        unitId = unit.id;
      }
    }

    // Date validation
    if (employee.dob && isNaN(new Date(employee.dob).getTime())) {
      errors.push('Invalid date of birth format');
    }
    if (employee.startDate && isNaN(new Date(employee.startDate).getTime())) {
      errors.push('Invalid start date format');
    }

    return {
      empNo: employee.empNo,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      mobile: employee.mobile,
      telephone: employee.telephone,
      gender: employee.gender,
      dob: employee.dob,
      departmentId: department?.id || 0,
      unitId,
      position: employee.position,
      highestQualification: employee.highestQualification,
      address: employee.address,
      country: employee.country,
      startDate: employee.startDate,
      maritalStatus: employee.maritalStatus,
      childrenNo: employee.childrenNo ? Number(employee.childrenNo) : undefined,
      bankName: employee.bankName,
      accountNo: employee.accountNo,
      bio: employee.bio,
      fingerprintId: employee.fingerprint,
      profilePicture: employee.profilePicture,
      role: employee.role,
      status: errors.length === 0 ? 'valid' : 'error',
      errors: errors.length > 0 ? errors : undefined,
    };
  };

  const processExcelFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Simulate processing progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            
            const processedData = jsonData.map((row: any) => validateEmployee({
              empNo: row['Employee Number'] || row['empNo'] || '',
              firstName: row['First Name'] || row['firstName'] || '',
              lastName: row['Last Name'] || row['lastName'] || '',
              email: row['Email'] || row['email'] || '',
              mobile: row['Mobile'] || row['mobile'] || '',
              telephone: row['Telephone'] || row['telephone'] || '',
              department: row['Department'] || row['department'] || '',
              unit: row['Unit'] || row['unit'] || '',
              position: row['Position'] || row['position'] || '',
              gender: row['Gender'] || row['gender'] || '',
              dob: row['Date of Birth'] || row['dob'] || '',
              highestQualification: row['Highest Qualification'] || row['highestQualification'] || '',
              address: row['Address'] || row['address'] || '',
              country: row['Country'] || row['country'] || '',
              startDate: row['Start Date'] || row['startDate'] || '',
              maritalStatus: row['Marital Status'] || row['maritalStatus'] || '',
              childrenNo: row['Children'] || row['childrenNo'] || '',
              bankName: row['Bank Name'] || row['bankName'] || '',
              accountNo: row['Account Number'] || row['accountNo'] || '',
              bio: row['Bio'] || row['bio'] || '',
              fingerprint: row['Fingerprint'] || row['fingerprint'] || '',
              profilePicture: row['Profile Picture'] || row['profilePicture'] || '',
              role: row['Role'] || row['role'] || '',
            }));
            
            setImportedData(processedData);
            setIsProcessing(false);
            setUploadProgress(0);
            
            toast({
              title: 'File Processed',
              description: `${processedData.length} employee records found in the file.`,
            });
          }
        }, 200);
      } catch (error) {
        setIsProcessing(false);
        setUploadProgress(0);
        toast({
          title: 'Error Processing File',
          description: 'Please ensure the file is a valid Excel format (.xlsx, .xls).',
          variant: 'destructive',
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processExcelFile(file);
    }
  }, [departments, units]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const downloadTemplate = () => {
    const templateData = [
      {
        'Employee Number': 'EMP001',
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@hospital.com',
        'Mobile': '+233 24 123 4567',
        'Telephone': '+233 30 123 4567',
        'Department': 'Emergency Department',
        'Unit': 'Emergency Room',
        'Position': 'Senior Nurse',
        'Gender': 'Male',
        'Date of Birth': '1990-01-15',
        'Highest Qualification': 'Bachelor of Nursing',
        'Address': '123 Main Street, Accra',
        'Country': 'Ghana',
        'Start Date': '2020-01-01',
        'Marital Status': 'Single',
        'Children': 0,
        'Bank Name': 'Ghana Commercial Bank',
        'Account Number': '1234567890',
        'Bio': 'Experienced nurse with 5 years in emergency care',
        'Fingerprint': 'FP001234567890',
        'Profile Picture': 'profile.jpg',
        'Role': 'employee'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Template');
    XLSX.writeFile(workbook, 'employee_import_template.xlsx');
    
    toast({
      title: 'Template Downloaded',
      description: 'Use this template to format your employee data.',
    });
  };

  const importEmployees = async () => {
    const validEmployees = importedData
      .filter(emp => emp.status === 'valid' && emp.departmentId)
      .map(emp => ({
        empNo: emp.empNo,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        mobile: emp.mobile,
        telephone: emp.telephone,
        gender: emp.gender,
        dob: emp.dob,
        departmentId: emp.departmentId,
        unitId: emp.unitId,
        position: emp.position,
        highestQualification: emp.highestQualification,
        address: emp.address,
        country: emp.country,
        startDate: emp.startDate,
        maritalStatus: emp.maritalStatus,
        childrenNo: emp.childrenNo,
        bankName: emp.bankName,
        accountNo: emp.accountNo,
        bio: emp.bio,
        fingerprintId: emp.fingerprintId,
        profilePicture: emp.profilePicture,
        role: emp.role
      }));

    if (validEmployees.length === 0) {
      toast({
        title: 'No Valid Employees',
        description: 'No valid employee records to import.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:3000/api/employees/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validEmployees),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import employees');
      }

      toast({
        title: 'Import Successful',
        description: `${data.importedCount || validEmployees.length} employees imported successfully. ${data.failedCount || 0} failed.`,
      });

      setImportedData([]);
    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = importedData.filter(emp => emp.status === 'valid' && emp.departmentId).length;
  const errorCount = importedData.filter(emp => emp.status === 'error' || !emp.departmentId).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Employees</h1>
        <p className="text-gray-500">Bulk import employee data from Excel files</p>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Import Instructions
          </CardTitle>
          <CardDescription>Follow these steps to import employee data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <p className="font-medium">Download the Excel template</p>
                <p className="text-sm text-gray-500">Use our template to format your employee data correctly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <p className="font-medium">Fill in employee information</p>
                <p className="text-sm text-gray-500">Complete all required fields in the template</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <p className="font-medium">Upload the completed file</p>
                <p className="text-sm text-gray-500">Drag and drop or click to select your Excel file</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Excel File</CardTitle>
          <CardDescription>Select an Excel file containing employee data</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the Excel file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag and drop an Excel file here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports .xlsx and .xls files
                </p>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Preview Card */}
      {importedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import Preview</CardTitle>
            <CardDescription>
              Review the data before importing ({validCount} valid, {errorCount} errors)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorCount > 0 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorCount} records have validation errors and will be skipped during import.
                </AlertDescription>
              </Alert>
            )}

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {importedData.map((employee, index) => (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg ${
                      employee.status === 'valid' && employee.departmentId
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {employee.status === 'valid' && employee.departmentId ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            {employee.firstName} {employee.lastName} ({employee.empNo})
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.email} - {employee.position}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {employee.errors && (
                      <div className="mt-2 ml-8">
                        <ul className="text-sm text-red-600 space-y-1">
                          {employee.errors.map((error, errorIndex) => (
                            <li key={errorIndex}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {validCount > 0 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={importEmployees} disabled={isProcessing}>
                  {isProcessing ? 'Importing...' : `Import ${validCount} Employees`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImportEmployees;