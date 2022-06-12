// npm i express
// 導入express模組
const express = require('express');
// 利用express來建立一個express application
const app = express();

const path = require('path');
require('dotenv').config();


// 因為 CORS 的關係，瀏覽器把 response 擋住
// 使用第三方開發的中間件 cors
const cors = require('cors');
// 這樣全開，但不包含跨源讀寫 cookie
// app.use(cors());
// origin: *
// 如果想要跨源讀寫 cookie
app.use(
  cors({
    // 為了要讓 browser 在 CORS 的情況下，還是幫我們縙 cookie
    // 這邊需要把 credentials 設定成 true，而且 origin 不可以是 *
    // 不然就太恐怖，誰都可以跨源讀寫 cookie
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// 啟用 session
// npm i express-session
// express-session 預設是存在應用程式的記體體 (node server.js)
// session-file-store 這個是為了把 session 存到硬碟去讓你們觀察
// npm i session-file-store
// 正式環境我們會在「記憶體」--> redis, memcached (database in memory)
// console.log('secret', process.env.SESSION_SECRET);
const expressSession = require('express-session');
let FileStore = require('session-file-store')(expressSession);
app.use(
  expressSession({
    store: new FileStore({
      // 把 sessions 存到 simple-express 的外面
      // 單純想避開 nodemon 的監控檔案變動重啟
      path: path.join(__dirname, '..', 'sessions'),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);



// express.urlencoded 要讓 express 認得 req 裡 body 裡面的資料
// extended: false --> querystring
// extended: true --> qs

// urlencoded 是把 data 放進 req.body 裡面！！但 express 這時候還看不懂 JSON 所以 req.body 此時是一個空物件
app.use(express.urlencoded({ extended: true }));
// 要讓 express 認得 req 裡 json 就要再加下面這行
app.use(express.json());

// express 處理靜態資料
// 靜態資料: html, css 檔案, javascript 檔案, 圖片, 影音檔...
// express 少數內建的中間件 static
// 方法1: 不要指定網址
app.use(express.static(path.join(__dirname, 'public', 'images')));
// http://localhost:3001/images/test1.jpg
// 方法2: 指定網址=> 前後配對^^
app.use('/images/members', express.static(path.join(__dirname, 'public','members')));

const StockRouter = require('./routers/stockRouter');
app.use('/api/stocks', StockRouter);

const AuthRouter = require('./routers/authRouter');
app.use('/api/auth', AuthRouter);

const MemberRouter = require('./routers/memberRouter');
app.use('/api/member', MemberRouter);

app.listen(3001, () => {
  console.log('Server running at port 3001');
});
