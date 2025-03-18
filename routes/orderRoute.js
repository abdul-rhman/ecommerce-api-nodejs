const express = require('express');
const cartController = require('../controllers/cartController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect)
router
  .route('/')
  .post(authController.restrictTo('customer')
        ,cartController.extractCartItems,
        productController.updateSoldProducts,
        cartController.clearCart,
        orderController.createOrder
  )
  .get(orderController.getMyOrders)

router
  .route('/:id')
  .delete(authController.restrictTo('customer'),
          orderController.cancelOrder)
  .patch(authController.restrictTo('admin'),
          orderController.updateOrder)
  .get(authController.restrictTo('customer'),
        orderController.getOrder)
module.exports = router;
