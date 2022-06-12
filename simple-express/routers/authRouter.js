// 固定寫法三行，背起乃
const express = require('express');
const router = express.Router();
//module.exports = router;
const pool = require('../utils/db');
const { body, validationResult } = require('express-validator');
const path = require('path');
const bcrypt = require('bcrypt');

// for image upload
const multer = require('multer');
// 圖片上船需要地方放，在 public 裡面建立一個 uploads 資料夾
// 設定圖片儲存位置
const storage = multer.diskStorage({
  // 設定儲存目的地(檔案夾)
  // 就是要這要寫，套件規定的
  destination: function (req, file, cb) {
    // cb 的第一個參數是 error，這邊單純存圖片，沒什麼錯誤就給 NULL
    cb(null, path.join(__dirname, '..', 'public', 'members'));
  },
  // 重新命名使用者上傳的圖片名稱
  filename: function (req, file, cb) {
    // console.log('multer filename', file);
    let ext = file.originalname.split('.').pop();
    let newFilename = `${Date.now()}.${ext}`;
    cb(null, newFilename);
    // {
    //   fieldname: 'photo',
    //   originalname: 'japan04-200.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg'
    // }
  },
});
// 這是一個中間件
const uploader = multer({
  //設定儲存位置
  storage: storage,
  // 過濾檔案類型
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpg' &&
      file.mimetype !== 'image/png'
    ) {
      cb('這不是可被接受的格式!', false);
    } else {
      cb(null, true);
    }
  },
  // 檔案尺寸的過濾
  limits: {
    // 1k = 1024
    fileSize: 200 * 1024,
  },
});

const registerRules = [
  body('email').isEmail().withMessage('請填寫正確 Email 格式'),
  body('email').isLength({ min: 8 }).withMessage('密碼長度至少為 8'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('密碼不一致'),
];
// /api/auth/register
router.post(
  '/register',
  uploader.single('photo'),
  registerRules,
  async (req, res, next) => {
    // 1. req.params <-- 網址上的路由參數 e.g, /:stockId
    // 2. req.query  <-- 網址上的 query string
    // 3. req.body <-- 就是前端傳送過來的資料
    console.log('register body*************', req.body);
    // 驗證資料
    // 拿到驗證結果
    const validateResults = validationResult(req);
    console.log('validateResults', validateResults);
    if (!validateResults.isEmpty()) {
      // 不是 empty --> 表示有不符合
      let error = validateResults.array();
      return res.status(400).json({ code: 3001, error: error });
    }

    // TODO: 確認 email 有沒有註冊過
    let [members] = await pool.execute(
      'SELECT id, email FROM members WHERE email = ?',
      [req.body.email]
    );
    if (members.length !== 0) {
      // 有人註冊過：

      return res
        .status(400)
        .json({ code: 3002, error: '這個 email 已經註冊過' });
      // 盡可能讓後端回覆的格式是一致的，如果無法完全一致，那至少要讓前端有判斷的依據。
      // 做專案的時候，在專案開始前，可以先討論好要回覆的錯誤格式與代碼。
    }

    // 圖片處理完成後，會被放在 req 物件裡
    console.log('req.file', req.file);
    // 最終前端需要的網址: http://localhost:3001/public/members/1655003030907.jpg
    // 可以由後端來組合這個網址，也可以由前端來組合
    // 記得不要把 http://locahost:3001 這個存進資料庫，因為正式環境部署會不同
    // 目前這個專案採用：儲存 members/1655003030907.jpg 這樣格式
    // 使用者不一定有上傳圖片，所以要確認 req 是否有 file
    let photo = req.file ? '/members/' + req.file.filename : '';
    // TODO: 密碼雜湊 hash //npm i bcrypt
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log('雜湊密碼:' + hashPassword);
    // TODO: save to db
    let [result] = await pool.execute(
      'INSERT INTO members (email, password, name, photo) VALUES (?,?,?,?)',
      [req.body.email, hashPassword, req.body.name, photo]
    );
    console.log('INSERT INTO****:', result);
    // response
    res.json({ result: 'ok' });
  }
);

// /api/auth/register
router.post('/login', async (req, res, next) => {
  // 確認資料有收到
  console.log('req.body***', req.body);
  // 確認有沒有這個帳號
  let [member] = await pool.execute(
    'SELECT id, name ,email, password, photo FROM members WHERE email = ?',
    [req.body.email]
  );
  if (member.length === 0) {
    // 如果沒有就回覆錯誤
    // 沒有註冊過：
    return res.status(400).json({ code: 3003, error: '帳號或密碼錯誤' });
  }

  member = member[0];
  // 如果有，確認密碼
  let passwordCompareResult = await bcrypt.compare(
    req.body.password,
    member.password
  );

  if (passwordCompareResult === false) {
    return (
      res
        .status(400)
        // 如果密碼不符合，回覆登入錯誤
        .json({ code: 3004, error: '帳號或密碼錯誤' })
    );
  }

  // 密碼符合就開始寫 session/cookie (或用 JWT 取代
  // （要先去 server.js 裡啟動 session）
  let returnMember = {
    email: member.email,
    name: member.name,
    photo: member.photo,
  };
  req.session.member = returnMember;
  // 回覆資料給前端
  res.json({ code: 0, member: returnMember });
});

router.get('/logout', (req, res, next) => {
  // 因為我們會依靠判斷 req.session.member 有沒有資料來當作有沒有登入
  // 所以當我們把 req.session.member 設定成 null，那就登出了
  req.session.member = null;
  res.sendStatus(202);
});
module.exports = router;
