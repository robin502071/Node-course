// read stock no from stock.txt

// npm i axios
const axios = require("axios");
const fs = require("fs");

new Promise((resolve, reject) => {
  fs.readFile("stock.txt", "utf-8", (err, stockNo) => {
    if (err) {
      console.log("讀取失敗");
      reject(err);
    } else {
      console.log("讀取失成功");
      resolve(stockNo);
    }
  });
})
  .then((stockNo) => {
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        // 設定 query string
        response: "json",
        date: "20220301",
        stockNo: stockNo,
      },
    });
  })
  .then((data) => {
    console.log(data.data);
  })
  .catch((err) => {
    console.log(err);
  });
 