const { fetchLogs, getUsers, addUser, deleteUser } = require('../utils/zktecoService');

// GET /api/zkteco/logs
exports.getLogs = async (req, res, next) => {
  try {
    const logs = await fetchLogs();
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// GET /api/zkteco/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// POST /api/zkteco/users
exports.addUser = async (req, res, next) => {
  try {
    const result = await addUser(req.body); // expects { uid, name, password, role, cardno }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/zkteco/users/:uid
exports.deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUser(req.params.uid);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
