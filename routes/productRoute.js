const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();


router
  .route('/')
  .get(productController.getProducts)
  .post(authController.protect,
        authController.restrictTo('seller'),
        productController.addProduct);

router
.route('/myproducts')
.get(authController.protect,
      authController.restrictTo('seller')
      ,productController.getMyProducts)

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(authController.protect, productController.updateProduct)
  .delete(authController.protect,  productController.deleteProduct);
  
module.exports = router;
