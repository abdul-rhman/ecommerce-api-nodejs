const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./models/productModel'); // Adjust the path if needed

const insertDummyProducts = async () => {
  try {
    // Connect to MongoDB (Update your DB connection string)
    await mongoose.connect('mongodb+srv://abdelrhman:FO4MtVz2y8zxm74Y@cluster0.ukx09.mongodb.net/myEcommerce?retryWrites=true&w=majority&appName=Cluster0');

    console.log('✅ Database Connected Successfully');

    // Read dummy products from JSON file
    const products = JSON.parse(fs.readFileSync('dummy_products.json', 'utf-8'));
    await Product.deleteMany();
    // Insert all products into MongoDB
    await Product.create(products);
    console.log('🎉 1000 Dummy Products Inserted Successfully');

    // Close DB connection
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error Inserting Products:', error);
    mongoose.connection.close();
  }
};

// Run the function
insertDummyProducts();