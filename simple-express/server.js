// npm i express
// 導入express模組
const express = require('express');
// 利用express來建立一個express application
const app = express();
const path = require('path');
// 因為 CORS 的關係，瀏覽器把 response 擋住
const cors = require('cors');
app.use(cors());

// express.urlencoded 要讓 express 認得 req 裡 body 裡面的資料
// extended: false --> querystring
// extended: true --> qs
app.use(express.urlencoded({ extended: true }));
// 要讓 express 認得 req 裡 json
app.use(express.json());

const StockRouter = require('./routers/stockRouter');
app.use('/api/stocks',StockRouter);

const AuthRouter = require('./routers/authRouter');
app.use('/api/auth',AuthRouter);


app.listen(3001, () => {
  console.log('Server running at port 3001');
});
