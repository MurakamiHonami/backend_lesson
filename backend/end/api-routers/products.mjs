import express, { Router } from "express";

const products = [
  { name: "table", price: 1000 },
  { name: "chair", price: 100 },
  { name: "clock", price: 700 },
];

const router=express.Router();
router.get('/products', function (req, res) {
  //データ全体を返す
  res.json(products);
});

router.get('/products/:id', function (req, res) {
  //指定されたIDの商品を返す
  const targetProduct = products[req.params.id]
  res.json(targetProduct);
});

router.post('/products', function (req, res) {
  //新しい商品を商品リストに追加する
  const newProduct=req.body;
  products.push(newProduct);
  //追加した商品を返す
  res.json(newProduct);
});

router.delete('/products/:id', function (req, res) {
  //指定されたIDの商品を削除する
  const deleteId=req.params.id;
  products.splice(deleteId,1);
  //削除した商品を返す
  res.json({deleteId});
});
router.patch('/products/:id', function (req, res) {
  //指定されたIDの商品情報を更新する
  const targetProduct = products[req.params.id];
  //nameに入力データがあればnameを更新
  if(req.body.hasOwnProperty('name')) {
    targetProduct.name=req.body.name;
  }
  //priceに入力データがあればpriceを更新
  if(req.body.hasOwnProperty('price')) {
    targetProduct.price=req.body.price;
  }
  //更新した結果を返す
  res.json(targetProduct);
});


export default router