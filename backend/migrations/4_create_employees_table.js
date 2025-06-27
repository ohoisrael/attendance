exports.up = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      emp_no VARCHAR(20) NOT NULL UNIQUE,
      user_id INT UNIQUE,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      mobile VARCHAR(20) NOT NULL,
      telephone VARCHAR(20),
      gender ENUM('male', 'female', 'other') NOT NULL,
      dob DATE NOT NULL,
      department_id INT NOT NULL,
      unit_id INT,
      position VARCHAR(100) NOT NULL,
      highest_qualification VARCHAR(100),
      address TEXT NOT NULL,
      country VARCHAR(50) NOT NULL,
      start_date DATE NOT NULL,
      marital_status ENUM('single', 'married', 'divorced', 'widowed'),
      children_no INT DEFAULT 0,
      bank_name VARCHAR(100),
      account_no VARCHAR(50),
      bio TEXT,
      fingerprint_id VARCHAR(50) UNIQUE,
      profile_picture VARCHAR(255),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (department_id) REFERENCES departments(id),
      FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL
    )
  `);
};

exports.down = async (db) => {
  await db.query(`DROP TABLE IF EXISTS employees`);
};