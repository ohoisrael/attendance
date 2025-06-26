import React, { useState, useCallback } from 'react';
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
  department: string;
  position: string;
  status: 'valid' | 'error';
  errors?: string[];
}

const ImportEmployees: React.FC = () => {
  const [importedData, setImportedData] = useState<ImportedEmployee[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useAuth();

  const validateEmployee = (employee: any): ImportedEmployee => {
    const errors: string[] = [];
    
    if (!employee.empNo) errors.push('Employee number is required');
    if (!employee.firstName) errors.push('First name is required');
    if (!employee.lastName) errors.push('Last name is required');
    if (!employee.email) errors.push('Email is required');
    if (!employee.mobile) errors.push('Mobile number is required');
    if (!employee.department) errors.push('Department is required');
    if (!employee.position) errors.push('Position is required');
    
    // Email validation
    if (employee.email && !/\S+@\S+\.\S+/.test(employee.email)) {
      errors.push('Invalid email format');
    }

    return {
      ...employee,
      status: errors.length === 0 ? 'valid' : 'error',
      errors: errors.length > 0 ? errors : undefined
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
              department: row['Department'] || row['department'] || '',
              position: row['Position'] || row['position'] || '',
              gender: row['Gender'] || row['gender'] || '',
              dob: row['Date of Birth'] || row['dob'] || '',
              address: row['Address'] || row['address'] || '',
              fingerprint: row['Fingerprint'] || row['fingerprint'] || '',
            }));
            
            setImportedData(processedData as ImportedEmployee[]);
            setIsProcessing(false);
            setUploadProgress(0);
            
            toast({
              title: "File Processed",
              description: `${processedData.length} employee records found in the file.`,
            });
          }
        }, 200);
        
      } catch (error) {
        setIsProcessing(false);
        setUploadProgress(0);
        toast({
          title: "Error Processing File",
          description: "Please ensure the file is a valid Excel format (.xlsx, .xls).",
          variant: "destructive",
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const downloadTemplate = () => {
    const templateData = [
      {
        'Employee Number': 'EMP001',
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@hospital.com',
        'Mobile': '+233 24 123 4567',
        'Department': 'Emergency Department',
        'Position': 'Senior Nurse',
        'Gender': 'Male',
        'Date of Birth': '1990-01-15',
        'Address': 'Accra, Ghana',
        'Fingerprint': 'FP001234567890'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Template');
    XLSX.writeFile(workbook, 'employee_import_template.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Use this template to format your employee data.",
    });
  };

  const importEmployees = () => {
    const validEmployees = importedData.filter(emp => emp.status === 'valid');
    // Here you would typically make API calls to save the employees
    // Example:
    // axios.post('http://localhost:3000/api/employees/bulk', validEmployees, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    console.log('Importing employees:', validEmployees);
    toast({
      title: "Import Successful",
      description: `${validEmployees.length} employees have been imported successfully.`,
    });
    // Reset the import data
    setImportedData([]);
  };

  const validCount = importedData.filter(emp => emp.status === 'valid').length;
  const errorCount = importedData.filter(emp => emp.status === 'error').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Employees</h1>
        <p className="text-gray-500">Bulk import employee data from Excel files</p>
      </div>

      {/* Instructions */}
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

      {/* File Upload */}
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

      {/* Import Preview */}
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
                      employee.status === 'valid' 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {employee.status === 'valid' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">
                            {employee.firstName} {employee.lastName} ({employee.empNo})
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.email} - {employee.department}
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
                <Button onClick={importEmployees}>
                  Import {validCount} Employees
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
