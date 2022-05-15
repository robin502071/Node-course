const fs = require('fs');

const p = new Promise((resolve, reject) => {
  fs.readFile('./readMePls.txt', 'utf-8', (err, data) => {
    if (err) {
      // 錯誤了
      reject(err);
      // console.log('喔喔喔，發生錯誤了');
      // console.error(err);
    } else {
      // 因為沒有 err，所以是正確的
      resolve(data);
      // console.log(data);
    }
  });
});

// p.then((data) => {
//   console.log('成功了');
//   console.log(data);
// }).catch((err) => {
//   console.log('拍謝失敗');
//   console.log(err);
// });

async function doP() {
  try {
    const result = await p;
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

doP();
