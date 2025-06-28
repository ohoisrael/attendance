const { getRealtimeLogsFromDevice } = require('../utils/zktecoService');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

class RealtimeAttendanceService {
  async start() {
    console.log('Starting real-time attendance listener...');
    await getRealtimeLogsFromDevice(async (log) => {
      try {
        // Find the employee by userId from the log
        console.log('Received real-time log:', log);
        const employee = await Employee.findByUserId(log.userId);
        if (!employee) {
          console.warn(`No employee found for userId: ${log.userId}`);
          return;
        }

        // Save attendance record
        await Attendance.create({
          employeeId: employee.id,
          date: new Date(log.timestamp).toISOString().split('T')[0],
          clockIn: log.status === 'Check-in' ? log.timestamp : null,
          clockOut: log.status === 'Check-out' ? log.timestamp : null,
          status: log.status,
          notes: 'Real-time log'
        });

        console.log(`Attendance saved for employee ${employee.id} at ${log.timestamp}`);
      } catch (error) {
        console.error('Error saving real-time attendance:', error);
      }
    });
  }
}

module.exports = new RealtimeAttendanceService();