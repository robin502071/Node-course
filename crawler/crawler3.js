// read stock no from stock.txt

// npm i axios
const axios = require('axios');
const fs = require('fs/promises');

(async function () {
  try {
    const stockText = await fs.readFile('./stock.txt', 'utf-8');
    const response = await axios.get(
      'https://www.twse.com.tw/exchangeReport/STOCK_DAY',
      {
        params: {
          // 設定 query string
          response: 'json',
          date: '20220301',
          stockNo: stockText,
        },
      }
    );
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
})();

