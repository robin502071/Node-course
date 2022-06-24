// 固定寫法三行，背起乃
const express = require('express');
const router = express.Router();

const path = require('path');
// for image upload
const multer = require('multer');
// 圖片上船需要地方放，在 public 裡面建立一個 uploads 資料夾
// 設定圖片儲存位置
const storage = multer.diskStorage({
  // 設定儲存目的地(檔案夾)
  // 就是要這要寫，套件規定的
  destination: function (req, file, cb) {
    // cb 的第一個參數是 error，這邊單純存圖片，沒什麼錯誤就給 NULL
    cb(null, path.join(__dirname, '..', 'public', 'upload'));
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
  // limits: {
  //   // 1k = 1024
  //   fileSize: 200 * 1024,
  // },
});

// /api/auth/register
router.post(
  '/',
  uploader.single('image'),
  async (req, res, next) => {
    
    let link = req.file ? '/upload/' + req.file.filename : '';
    
    // response
    // 改成符合imgur的
    res.json({ result: 'ok', data:{link} });
  }
);


module.exports = router;
