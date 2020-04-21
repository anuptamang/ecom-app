const express = require('express');
const productsRepo = require('../repositories/products');
const productsIndexTemplate = require('../views/products/index');

const usersRepo = require('../repositories/users');

const router = express.Router();

router.get('/', async (req, res) => {
  const id = req.session.userId;
  let fname;
  if (id) {
    const user = await usersRepo.getOneBy({ id });

    fname = user.fname;
  }
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ fname, products }));
});

module.exports = router;
