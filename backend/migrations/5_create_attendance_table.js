exports.up = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT NOT NULL,
      date DATE NOT NULL,
      clock_in TIME,
      clock_out TIME,
      hours_worked DECIMAL(5,2),
      status ENUM('present', 'absent', 'late', 'early_departure') NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
      UNIQUE KEY unique_employee_date (employee_id, date)
    )
  `);
};

exports.down = async (db) => {
  await db.query(`DROP TABLE IF EXISTS attendance`);
};