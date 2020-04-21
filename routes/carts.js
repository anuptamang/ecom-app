const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const usersRepo = require('../repositories/users');

const router = express.Router();

// Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // Figure out the cart!
  let cart;
  if (!req.session.cartId) {
    // We dont have a cart, we need to create one,
    // and stor the cart id on the <req className="session cartId
    // property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // we have a cart! lets get it from the repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  // Either increment quanity for existing product or add new product
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingItem) {
    // increment quanity and save cart
    existingItem.quantity++;
  } else {
    // add new poduct id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.redirect('/cart');
});

// Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  const id = req.session.userId;
  let fname;
  if (id) {
    const user = await usersRepo.getOneBy({ id });

    fname = user.fname;
  }

  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);

    item.product = product;
  }

  res.send(cartShowTemplate({ fname, items: cart.items }));
});

// Receive a post request to delete an item from a cart
router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);
  await cartsRepo.update(req.session.cartId, { items });
  res.redirect('/cart');
});

module.exports = router;
