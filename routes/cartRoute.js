const express = require('express');
const cartController = require('../controllers/cartController');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('customer'))
router
  .route('/')
  .get(cartController.getCartItems)
  .delete(cartController.clearCart)
  .post(cartController.checkItemExistingQuantity,productController.checkItemAvailability,cartController.addItemToCart)
  .patch(productController.checkItemAvailability,cartController.updateItemQuantity);

router
  .route('/:id')
  .delete(cartController.deleteItemFromCart)

module.exports = router;
