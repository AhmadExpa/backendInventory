const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get all products - accessible by anyone (employees, users)
router.get("/", authMiddleware(["admin", "employee", "user"]), getAllProducts);

// Create a new product - admin only
router.post("/", authMiddleware(["admin"]), createProduct);

// Update a product - employee can modify limited fields, admin can modify all
router.put("/:id", authMiddleware(["employee", "admin"]), updateProduct);

// Delete a product - admin only
router.delete("/:id", authMiddleware(["admin"]), deleteProduct);

module.exports = router;
