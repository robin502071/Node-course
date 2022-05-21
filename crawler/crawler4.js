const mysql = require('mysql2/promise');

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'weiwei',
    password: '',
    database: 'nodejscourse',
  });

  // query database
  const [rows, fields] = await connection.execute('SELECT * FROM stocks');
  console.log(rows);
  connection.end();
})();
