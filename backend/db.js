import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     +process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then(conn => {
    console.log('✔ [db.js] Connection OK');
    conn.release();
  })
  .catch(err => {
    console.error('✖ [db.js] Connection ERROR:', err);
  });
