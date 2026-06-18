import express from 'express';
import router from './api-routers/products.mjs';

//ポート番号を指定
const PORT = 8080;
//expressを使用する宣言
const app = express();

//jsonでデータのやり取りをする設定
app.use(express.json());

//routerでルーティングを行う宣言
app.use(router);

//サーバーを起動
app.listen(PORT, function () {
  console.log(`Server start: http://localhost:${PORT}`);
});
