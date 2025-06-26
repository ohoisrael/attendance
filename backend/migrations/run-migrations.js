const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  try {
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.js') && file !== 'run-migrations.js')
      .sort();
    
    for (const file of migrationFiles) {
      const migration = require(path.join(__dirname, file));
      console.log(`Running migration: ${file}`);
      await migration.up(db);
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
};

runMigrations();