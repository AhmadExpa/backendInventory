const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  retailPrice: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  discount: { type: Number, required: true },
  recentCheckInDate: { type: Date, required: true },
  recentCheckOutDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  freePieces: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now }, // New field for updated timestamp
});

// Update `updatedAt` automatically on save
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
