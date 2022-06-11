// 固定寫法三行，背起乃
const express = require('express');
const router = express.Router();
//module.exports = router;

const pool = require('../utils/db')
router.get('/', async (request, response, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM stocks');
  response.json(data);
});
// 取得單一股票，:stockId 是一個變數
router.get('/:stockId', async (request, response, next) => {
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

  let [pageResults] = await pool.execute(
    'SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date DESC LIMIT  ? OFFSET ?',
    [request.params.stockId, perPage, offset]
  );


  response.json({
    pagination: {
      total,
      lastPage,
      page
    },
    data: pageResults
  });
});
module.exports = router;


