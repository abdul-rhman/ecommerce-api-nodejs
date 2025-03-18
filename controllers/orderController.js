const Order = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.createOrder = catchAsync(async(req,res,next)=>{
    const order = await Order.create({
        shippingAddress: req.user.address,
        items: req.orderItems,
        totalPrice : req.totalPrice,
        user : req.user._id
    })

    const populatedOrder = await Order.findById(order._id).populate('items.product');

    return res.status(201).json({ success: true, order: populatedOrder });
})

exports.cancelOrder = catchAsync(async(req,res,next)=>{
    const order = await Order.findOne({_id: req.params.id , user: req.user._id})
    
    if(!order)
    return next(new AppError("Order not found or unauthorized",404))
    
    if(['Delivered','Shipped'].includes(order.status))
        return next(new AppError(`Order can not be canceled in ${order.status} status`,400))
    
    order.status = 'Cancelled';
    await order.save();
    
    return res.status(200).json({ success: true, order });
})

exports.updateOrder = catchAsync(async(req,res,next)=>{
    ['createdAt','totalPrice','items','user'].forEach(element => {
        if(element in req.body) delete req.body[element]
    });
    const order = await Order.findByIdAndUpdate(req.params.id,
        req.body,{new : true , runValidators:true})

    if (!order) {
        return next(new AppError('Order not found',404))
    }

    return res.status(200).json({ success: true, order });
})

exports.getOrder = catchAsync(async(req,res,next)=>{
    const order = await Order.findOne({_id: req.params.id , user: req.user._id})
    
    if(!order)
    return next(new AppError('Order not found or unauthorized',404))
    
    return res.status(200).json({ success: true, order });
})

exports.getMyOrders= catchAsync(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id})
    
    return res.status(200).json({ success: true, orders });
})
