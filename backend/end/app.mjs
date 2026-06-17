import express from 'express';
import router from './api-routers/products.mjs';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(router);


app.listen(PORT, function () {
  console.log(`Server start: http://localhost:${PORT}`);
});
