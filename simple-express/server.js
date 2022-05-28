// npm i express
// 導入express模組
const express = require('express');
// 利用express來建立一個express application
const app = express();
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();
let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // 為了 pool 新增的參數
  connectionLimit: 10,
});
// 取得所有股票
app.get('/stocks', async (request, response, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM stocks');
  response.json(data);
});
// 取得單一股票，:stockId 是一個變數
app.get('/stocks/:stockId', async (request, response, next) => {
  let [data, fields] = await pool.execute(
    'SELECT * FROM stocks WHERE id =' + request.params.stockId
  );
  response.json(data);
});

app.listen(3001, () => {
  console.log('Server running at port 3001');
});
