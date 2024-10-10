const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product (admin only)
exports.createProduct = async (req, res) => {
  const {
    productName,
    retailPrice,
    purchasePrice,
    discount,
    recentCheckInDate,
    recentCheckOutDate,
    quantity,
    freePieces,
  } = req.body;

  try {
    const newProduct = new Product({
      productName,
      retailPrice,
      purchasePrice,
      discount,
      recentCheckInDate,
      recentCheckOutDate,
      quantity,
      freePieces,
      createdBy: req.user._id,
    });

    await newProduct.save(); // Corrected to save the new product
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (employees can only modify certain fields, admin can modify all)
exports.updateProduct = async (req, res) => {
  const { role } = req.user; // `authMiddleware` passes role from token
  const {
    productName,
    retailPrice,
    purchasePrice,
    discount,
    recentCheckInDate,
    recentCheckOutDate,
    quantity,
    freePieces,
  } = req.body;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (role === "admin") {
      // Admin can modify all fields
      product.productName = productName || product.productName;
      product.retailPrice = retailPrice || product.retailPrice;
      product.purchasePrice = purchasePrice || product.purchasePrice;
      product.discount = discount || product.discount;
    }

    // Employees can only update specific fields
    product.recentCheckInDate = recentCheckInDate || product.recentCheckInDate;
    product.recentCheckOutDate =
      recentCheckOutDate || product.recentCheckOutDate;
    product.quantity = quantity || product.quantity;
    product.freePieces = freePieces || product.freePieces;
    product.updatedBy = req.user._id; // Set the user who updated
    // updatedAt is automatically handled by the model schema

    await product.save();
    res.status(200).json({
      id: product._id, // or other fields you want to return
      updatedAt: product.updatedAt, // return only the latest update timestamp
      updatedBy: product.updatedBy, // return the user ID who last updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
