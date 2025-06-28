const { fetchLogs } = require('../utils/zktecoService');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

class AttendanceSyncService {
  constructor() {
    this.isRunning = false;
    this.interval = null;
  }

  async processLogs(logs) {
    for (const log of logs) {
      try {
        // Find employee by fingerprint ID or user ID
        const employee = await Employee.findByFingerprintId(log.userId) || 
                        await Employee.findByUserId(log.userId);
        
        if (employee) {
          // Check if attendance record already exists for this timestamp
          const existingRecord = await Attendance.findByEmployeeAndTime(
            employee.id, 
            log.timestamp
          );
          
          if (!existingRecord) {
            // Create new attendance record
            await Attendance.create({
              employeeId: employee.id,
              timestamp: log.timestamp,
              type: log.status.toLowerCase(),
              deviceIp: log.deviceIp
            });
            
            console.log(`New attendance: ${employee.first_name} ${log.status} at ${log.timestamp}`);
          }
        }
      } catch (error) {
        console.error('Error processing log:', error);
      }
    }
  }

  async syncAttendance() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    try {
      const logs = await fetchLogs();
      if (logs.length > 0) {
        await this.processLogs(logs);
      }
    } catch (error) {
      console.error('Attendance sync error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  start() {
    if (this.interval) return;
    
    console.log('Starting attendance sync service...');
    this.syncAttendance(); // Run immediately
    // this.interval = setInterval(() => {
    //   this.syncAttendance();
    // }, 5000); // Every 5 seconds
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Attendance sync service stopped');
    }
  }
}

module.exports = new AttendanceSyncService();