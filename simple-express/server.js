// npm i express
// 導入express模組
const express = require('express');
// 利用express來建立一個express application
const app = express();

app.get('/', (request, response, next) => {
  // 一定要res
  response.send('ok');
});
app.get('/about', (request, response, next) => {
  response.send('about');
});

app.listen(3001, () => {
  console.log('Server running at port 3001');
});
