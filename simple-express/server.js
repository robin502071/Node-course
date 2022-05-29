// npm i express
// 導入express模組
const express = require('express');
// 利用express來建立一個express application
const app = express();
const path = require('path');
const mysql = require('mysql2/promise');
// 因為 CORS 的關係，瀏覽器把 response 擋住
const cors = require('cors');
app.use(cors());

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
    'SELECT * FROM stock_prices WHERE stock_id = ?',
    [request.params.stockId]
  );

  // RESTful 風格之下鼓勵把過濾參數用 query string 來傳遞
  // /stocks/:stockId?page=1
  // 取得目前在第幾頁並且給預設值為 1
  let page = request.query.page || 1;

  // 取得目前的總筆數
  const total = data.length;
  // 計算總共有幾頁
  const perPage = 5; // 每頁幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算 offsect 是多少 => 要跳過幾筆
  let offset = (page - 1) * perPage;
  console.log(offset);
  response.json({
    paginaton: {},
    data,
  });
});

app.listen(3001, () => {
  console.log('Server running at port 3001');
});
