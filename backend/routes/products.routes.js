const express = require("express");
const { productModel } = require("../models/product.model");
const { adminauth } = require("../middleware/adminauth");

const productRouter = express.Router();

productRouter.post("/create", adminauth, async (req, res) => {
  try {
    const product = new productModel(req.body);
    await product.save();
    res.json({ msg: "Product created successfully", product: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.get("/products", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page
  const sortBy = req.query.sortBy || "createdAt"; // Default sort by createdAt field
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default sort order ascending

  try {
    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;

    const products = await productModel
      .find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

productRouter.get("/product/:productID", async (req, res) => {
  const { productID } = req.params;
  try {
    const product = await productModel.findById(productID);
    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.patch("/update/:productID", async (req, res) => {
  const { productID } = req.params;
  try {
    const product = await productModel.findByIdAndUpdate(productID, req.body, {
      new: true,
    });
    if (product) {
      res.json({ msg: "Product updated successfully" });
    } else {
      res.status(404).json({ msg: "Invalid product ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.delete("/delete/:productID", async (req, res) => {
  const { productID } = req.params;
  try {
    const product = await productModel.findByIdAndDelete(productID);
    if (product) {
      res.json({ msg: "Product deleted successfully" });
    } else {
      res.status(404).json({ msg: "Invalid product ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { productRouter };
