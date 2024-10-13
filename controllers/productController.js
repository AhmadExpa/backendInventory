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
    res.status(201).json({ message: "Product Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (employees can only modify certain fields, admin can modify all)
// Update product (employees can only modify certain fields, admin can modify all)
exports.updateProduct = async (req, res) => {
  const { role } = req.user;
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
      product.recentCheckInDate =
        recentCheckInDate || product.recentCheckInDate;
    }

    // Employees can only update specific fields
    product.recentCheckOutDate =
      recentCheckOutDate || product.recentCheckOutDate;

    // Fix for the quantity issue
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.freePieces =
      freePieces !== undefined ? freePieces : product.freePieces;

    product.updatedBy = req.user._id;

    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
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
