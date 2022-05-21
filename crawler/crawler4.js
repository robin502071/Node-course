const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // query database
  const [rows, fields] = await connection.execute('SELECT * FROM stocks');
  console.log(rows);
  connection.end();
})();
