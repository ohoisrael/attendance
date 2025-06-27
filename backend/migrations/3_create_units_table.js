exports.up = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS units (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      department_id INT NOT NULL,
      head_of_unit VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
      UNIQUE KEY unique_unit_department (name, department_id)
    )
  `);
};

exports.down = async (db) => {
  await db.query(`DROP TABLE IF EXISTS units`);
};