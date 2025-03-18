const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const { isUndefined } = require('util');

exports.addProduct = catchAsync(async (req,res,next)=>
{
    if(req.body.createdAt)
        delete req.body.createdAt

    req.body.seller = req.user._id;

    const product = await Product.create(req.body);

    return res.status(200).json({ success: true, date: product});
})

exports.updateProduct = catchAsync(async (req,res,next)=>
{
    if(req.body.createdAt)
        delete req.body.createdAt

    const product = await Product.findOneAndUpdate({_id:req.params.id, seller:req.user._id},req.body,{runValidators:true,new:true});
    
    if(!product)
    {
        return next(new AppError("Product not found or unauthorized",404))
    }
    return res.status(200).json({ success: true, date: product});
})

exports.deleteProduct = catchAsync(async (req,res,next)=>
{
    const options = {_id:req.params.id};
    
    if(req.user.role !== 'admin') options.seller = req.user._id;
    
    const product = await Product.findOneAndDelete(options);

    if(!product)
    {
        return next(new AppError('Product not found or unauthorized',404))
    }
    return res.status(204).json({ success: true, date: null});
})

exports.getProducts = factory.getAll(Product,{stock : {$gt : 0}});


exports.getMyProducts = catchAsync(async (req,res,next)=>
{
    const products = await Product.find({seller:req.user._id}).select('-seller');
    if(products.length==0)
    {
        return next(new AppError('no products are available',404))
    }
    return res.status(200).json({ success: true, result : products.length, date: products});
})
exports.getProduct = catchAsync(async (req,res,next)=>
{
    const product = await Product.findOne({_id:req.params.id}).populate({path :'seller',select:'storeName'});
    if(!product)
    {
        return next(new AppError('Product not found',404))
    }
    return res.status(200).json({ success: true, date: product});
})

exports.checkItemAvailability = catchAsync(async (req,res,next)=>
{
    if(req.body.quantity < 1)
    {
        return next(new AppError('quantity should be atleast 1',400))
    }
    let quantity = req.targetItemQuantity?req.targetItemQuantity+req.body.quantity :req.body.quantity;
    const product = await Product.findById(req.body.product);
    if(!product)
        return next(new AppError('Product not found',404))
    if(!(await product.isQuantityAvailable(quantity)))
        return next(new AppError('there is no available stock tor this item',400))
    next();
})

exports.updateSoldProducts = catchAsync(async (req,res,next)=>
{
    const products = await Product.find({_id : {$in :req.items}});

    if (products.some(product => !product)) 
        return next(new AppError('there is something wrong with your cart or there is a wrong product ID',400))
    
    const sortedProducts = req.items.map(id => products.find(p => p._id.toString() === id));
    
    if (sortedProducts.length !== req.items.length) {
        return next(new AppError('Invalid product IDs in cart',400))
    }

    const unavailableItems = (
        await Promise.all(
            sortedProducts.map(async (product, i) => {
            return (await product.isQuantityAvailable(req.count[i])) ? null : product;
          })
        )
      ).filter(Boolean);
    if(unavailableItems.length>0)
        return next(new AppError('some items are out of stock',400))
    
    await Promise.all(sortedProducts.map((product, i) => product.sellProduct(req.count[i])));

    req.orderItems = sortedProducts.map((product,i,arr)=>
    {
        return {
            product: req.items[i],
            quantity: req.count[i],
            priceAtPurchase: product.price
        }
    });

    req.totalPrice = req.orderItems.reduce((acc,item)=>acc+item.priceAtPurchase*item.quantity,0)
    
    next();
})