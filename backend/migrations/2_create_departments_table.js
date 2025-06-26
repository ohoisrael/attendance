exports.up = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      work_hours VARCHAR(50) NOT NULL,
      room VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.query(`DROP TABLE IF EXISTS departments`);
};