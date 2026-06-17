import express, { Router } from "express";

const products = [
  { name: "table", price: 1000 },
  { name: "chair", price: 100 },
  { name: "clock", price: 700 },
];

const router=express.Router();
router.#TODO('/products', function (req, res) {
  res.json(products);
});

router.get('/products/:id', function (req, res) {
  const target = products[req.params.id]
  res.json(target);
});

router.#TODO('/products', function (req, res) {
  const newProduct=req.body;
  products.push(newProduct);
  console.log(products);
  res.json(newProduct);
});

router.#TODO('/products/:id', function (req, res) {
  const deleteId=req.params.id;
  products.splice(deleteId,1);
  console.log(products);
  res.json({deleteId});
});
router.#TODO('/products/:id', function (req, res) {
  const targetProduct = products[req.params.id];
  if(req.body.hasOwnProperty('name')) {
    targetProduct.name=req.body.name;
  }
  if(req.body.hasOwnProperty('price')) {
    targetProduct.price=req.body.price;
  }
  console.log(products)

  res.json(targetProduct);
});


export default router