const Zkteco = require('zkteco-js');

const deviceConfig = {
  ip: '192.168.154.201',
  port: 4370,
  timeout: 5000,
  inport: 5200
};

async function fetchLogs() {
  const device = new Zkteco(deviceConfig.ip, deviceConfig.port, deviceConfig.timeout, deviceConfig.inport);

  try {
    // Connect to the device
    await device.createSocket();
    console.log('Connected to WL30');

    // Skip getInfo and directly fetch attendance logs
    const logs = await device.getAttendances();
    console.log('Raw Logs:', logs);

    // Map logs to the required format
    return logs.data.map(log => ({
      userId: log.uid || log.userId || log.id, // Adjust based on actual response
      timestamp: new Date(log.time || log.timestamp),
      status: log.state === 0 ? 'Check-in' : 'Check-out',
      deviceIp: deviceConfig.ip
    }));
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error(`Device communication failed: ${error.message}`);
  } finally {
    await device.disconnect();
  }
}

module.exports = { fetchLogs };