const Cart = require('./../models/cartModel')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.getCartItems = catchAsync(async (req,res,next)=>
{
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        return res.status(200).json({ success: true, message: "Your cart is empty", items: [], total: 0 });
    }
    const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return res.status(200).json({ success: true, items: cart.items, total });
})

exports.clearCart = catchAsync(async (req,res,next)=>
{
    await Cart.findOneAndDelete({user:req.user._id})
    if(req.orderItems) return next();
    return res.status(204).send();
})

exports.addItemToCart = catchAsync(async (req,res,next)=>
{
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
        cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product._id.toString() === req.body.product);

    if (existingItem) {
        existingItem.quantity += req.body.quantity; 
    } else {
        cart.items.push({ product: req.body.product, quantity: req.body.quantity }); 
    }

    await cart.save(); 
    cart = await Cart.findById(cart._id).populate('items.product');

    const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return res.status(200).json({ success: true, items: cart.items, total });
})
exports.updateItemQuantity = catchAsync(async (req,res,next)=>
{
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) { 
        return next(new AppError('this item is not exists in the cart',404))
    }

    const targetItem = cart.items.find(item => item.product.toString() === req.body.product);

    if (targetItem) {
        targetItem.quantity = req.body.quantity; 
    }
    else
    {
       return next(new AppError('this item is not exists in the cart',404))
    }

    await cart.save(); 
    cart = await Cart.findById(cart._id).populate('items.product');

    const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return res.status(200).json({ success: true, items: cart.items, total });
})

exports.checkItemExistingQuantity = catchAsync(async (req,res,next)=>
{
    let cart = await Cart.findOne({ user: req.user._id});

    if (!cart) {
        return next();
    }

    const targetItem = cart.items.find(item => item.product.toString() === req.body.product);
    if (!targetItem) {
        return next();
    }
    req.targetItemQuantity = targetItem.quantity;
    return next();
    })

exports.deleteItemFromCart = catchAsync(async (req,res,next)=>
{
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart || !cart.items.length) {
        return next(new AppError('Cart is empty or does not exist',404))
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() == req.params.id);

    if (itemIndex === -1) {
        return next(new AppError('Item not found in cart',404))
    }

    cart.items.splice(itemIndex, 1);

    await cart.save(); 
    cart = await Cart.findById(cart._id).populate('items.product');

    const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return res.status(200).json({ success: true, message: 'Item removed from cart', items: cart.items, total });
});

exports.extractCartItems = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        return next(new AppError('Your cart is empty',400))
    }

    req.items = cart.items.map(item => item.product._id.toString());
    req.count = cart.items.map(item => item.quantity);
    

    next();
});