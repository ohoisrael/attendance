
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Users, 
  Building2, 
  Clock, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Smartphone,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    hospitalName: 'General Hospital',
    hospitalCode: 'GH001',
    timezone: 'GMT+0',
    dateFormat: 'DD/MM/YYYY',
    currency: 'USD',
    language: 'English'
  });

  // Attendance Settings State
  const [attendanceSettings, setAttendanceSettings] = useState({
    workingHoursStart: '08:00',
    workingHoursEnd: '17:00',
    lateThreshold: 15,
    overtimeThreshold: 8,
    breakDuration: 60,
    enableFingerprint: true,
    enableFaceRecognition: false,
    requireCheckOut: true
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lateArrivalAlerts: true,
    absenteeAlerts: true,
    overtimeAlerts: true,
    weeklyReports: true,
    monthlyReports: true
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 3,
    twoFactorAuth: false,
    ipRestriction: false,
    auditLog: true
  });

  const handleSaveSettings = async (category: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: `${category} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>
        <Badge variant="outline">Admin Access Required</Badge>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>General System Settings</span>
              </CardTitle>
              <CardDescription>
                Configure basic system information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    value={systemSettings.hospitalName}
                    onChange={(e) => setSystemSettings({...systemSettings, hospitalName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalCode">Hospital Code</Label>
                  <Input
                    id="hospitalCode"
                    value={systemSettings.hospitalCode}
                    onChange={(e) => setSystemSettings({...systemSettings, hospitalCode: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GMT-12">GMT-12</SelectItem>
                      <SelectItem value="GMT-8">GMT-8 (PST)</SelectItem>
                      <SelectItem value="GMT-5">GMT-5 (EST)</SelectItem>
                      <SelectItem value="GMT+0">GMT+0 (UTC)</SelectItem>
                      <SelectItem value="GMT+1">GMT+1 (CET)</SelectItem>
                      <SelectItem value="GMT+8">GMT+8 (CST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="GHS">GHS (₵)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('System')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save System Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Settings Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Attendance Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure attendance tracking and working hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workStart">Working Hours Start</Label>
                  <Input
                    id="workStart"
                    type="time"
                    value={attendanceSettings.workingHoursStart}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, workingHoursStart: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workEnd">Working Hours End</Label>
                  <Input
                    id="workEnd"
                    type="time"
                    value={attendanceSettings.workingHoursEnd}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, workingHoursEnd: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateThreshold">Late Arrival Threshold (minutes)</Label>
                  <Input
                    id="lateThreshold"
                    type="number"
                    value={attendanceSettings.lateThreshold}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, lateThreshold: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeThreshold">Overtime Threshold (hours)</Label>
                  <Input
                    id="overtimeThreshold"
                    type="number"
                    value={attendanceSettings.overtimeThreshold}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, overtimeThreshold: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    value={attendanceSettings.breakDuration}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, breakDuration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Attendance Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Fingerprint Authentication</Label>
                      <p className="text-sm text-muted-foreground">Allow employees to clock in/out using fingerprint</p>
                    </div>
                    <Switch
                      checked={attendanceSettings.enableFingerprint}
                      onCheckedChange={(checked) => setAttendanceSettings({...attendanceSettings, enableFingerprint: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Face Recognition</Label>
                      <p className="text-sm text-muted-foreground">Allow employees to clock in/out using face recognition</p>
                    </div>
                    <Switch
                      checked={attendanceSettings.enableFaceRecognition}
                      onCheckedChange={(checked) => setAttendanceSettings({...attendanceSettings, enableFaceRecognition: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Check-out</Label>
                      <p className="text-sm text-muted-foreground">Employees must check out at the end of their shift</p>
                    </div>
                    <Switch
                      checked={attendanceSettings.requireCheckOut}
                      onCheckedChange={(checked) => setAttendanceSettings({...attendanceSettings, requireCheckOut: checked})}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('Attendance')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Attendance Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Alert Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Late Arrival Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when employees arrive late</p>
                      </div>
                      <Switch
                        checked={notificationSettings.lateArrivalAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lateArrivalAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Absentee Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about employee absences</p>
                      </div>
                      <Switch
                        checked={notificationSettings.absenteeAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, absenteeAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Overtime Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about overtime hours</p>
                      </div>
                      <Switch
                        checked={notificationSettings.overtimeAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, overtimeAlerts: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Report Schedules</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly attendance summaries</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Monthly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive monthly attendance reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.monthlyReports}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, monthlyReports: checked})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('Notification')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Minimum Password Length</Label>
                  <Input
                    id="passwordLength"
                    type="number"
                    min="6"
                    max="32"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="480"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Policies</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Special Characters</Label>
                      <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireSpecialChars}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireSpecialChars: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Enable 2FA for all users</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP Address Restriction</Label>
                      <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch
                      checked={securitySettings.ipRestriction}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ipRestriction: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all system activities</p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLog}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, auditLog: checked})}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('Security')} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Maintenance</span>
              </CardTitle>
              <CardDescription>
                System backup and maintenance operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Database Backup</h4>
                  <p className="text-sm text-muted-foreground">Create a backup of the system database</p>
                </div>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Clear Cache</h4>
                  <p className="text-sm text-muted-foreground">Clear system cache to improve performance</p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
