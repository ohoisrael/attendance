const Zkteco = require('zkteco-js');

const deviceConfig = {
  ip: '192.168.154.201',
  port: 4370,
  timeout: 5000,
  inport: 5200
};

// Get attendance logs
async function fetchLogs() {
  const device = new Zkteco(deviceConfig.ip, deviceConfig.port, deviceConfig.timeout, deviceConfig.inport);
  try {
    await device.createSocket();
    const logs = await device.getAttendances();
    return logs.data.map(log => ({
      userId: log.uid || log.userId || log.id,
      timestamp: new Date(log.time || log.timestamp),
      status: log.state === 0 ? 'Check-in' : 'Check-out',
      deviceIp: deviceConfig.ip
    }));
  } catch (error) {
    throw new Error(`Device communication failed: ${error.message}`);
  } finally {
    await device.disconnect();
  }
}

// Get all users from the device
async function getUsers() {
  const device = new Zkteco(deviceConfig.ip, deviceConfig.port, deviceConfig.timeout, deviceConfig.inport);
  try {
    await device.createSocket();
    const users = await device.getUsers();
    return users.data;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  } finally {
    await device.disconnect();
  }
}

// Add a new user to the device
async function addUser(user) {
  const device = new Zkteco(deviceConfig.ip, deviceConfig.port, deviceConfig.timeout, deviceConfig.inport);
  try {
    await device.createSocket();
    // user: { uid, name, password, role, cardno }
    const result = await device.setUser(user);
    return result;
  } catch (error) {
    throw new Error(`Failed to add user: ${error.message}`);
  } finally {
    await device.disconnect();
  }
}

// Delete a user from the device
async function deleteUser(uid) {
  const device = new Zkteco(deviceConfig.ip, deviceConfig.port, deviceConfig.timeout, deviceConfig.inport);
  try {
    await device.createSocket();
    const result = await device.removeUser(uid);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  } finally {
    await device.disconnect();
  }
}

// Listen for real-time logs (if supported)
async function getRealtimeLogs(callback) {
  const device = new Zkteco(deviceConfig.ip, deviceConfig.port, deviceConfig.timeout, deviceConfig.inport);
  try {
    await device.createSocket();
    device.on('attendance', log => {
      callback(log);
    });
    // Keep the connection open for real-time events
  } catch (error) {
    throw new Error(`Failed to get real-time logs: ${error.message}`);
  }
}

module.exports = {
  fetchLogs,
  getUsers,
  addUser,
  deleteUser,
  getRealtimeLogs
};