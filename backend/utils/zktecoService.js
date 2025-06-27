const ZKLib = require('zklib');

const deviceConfig = {
  ip: '192.168.1.100', // Replace with your WL30 IP
  port: 4370,
  password: '12345'     // Default admin password
};

async function fetchLogs() {
  let client;
  try {
    client = await ZKLib.connect(deviceConfig.ip, deviceConfig.port);
    await client.getTime(); // Test connection
    await client.setPassword(deviceConfig.password);
    const logs = await client.getAttendances();
    
    return logs.map(log => ({
      userId: log.uid,
      timestamp: new Date(log.timestamp),
      status: log.status === 0 ? 'Check-in' : 'Check-out',
      deviceIp: deviceConfig.ip
    }));
  } catch (error) {
    console.error('ZKTeco fetch error:', error.message);
    return []; // Return empty array on error
  } finally {
    if (client) await client.disconnect();
  }
}

module.exports = { fetchLogs };