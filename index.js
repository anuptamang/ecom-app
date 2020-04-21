const express = require('express');
const bodyParser = require('body-parser'); // Middleware
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Middlewae IMPL for all app.REQUEST
app.use(
  cookieSession({
    keys: ['djlkd;safkjsdfj'],
  })
);

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(port, () => {
  console.log('App listening on port ' + port);
});
