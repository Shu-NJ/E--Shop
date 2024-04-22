const express = require("express");
const { productModel } = require("../models/product.model");
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const productRouter = express.Router();

productRouter.post("/create", adminauth, async (req, res) => {
  try {
    const product = new productModel(req.body);
    await product.save();
    res.json({ msg: "product created sucessfully", product: req.body });
  } catch (error) {
    res.json({ err: error.message });
  }
});

productRouter.get("/products", async (req, res) => {
  try {
    const data1 = await productModel.find();
    res.json({ data: data1 });
  } catch (error) {
    res.json({ err: error.message });
  }
});
productRouter.get("/products/search", async (req, res) => {
  const { brand, category, title } = req.query;
  try {
    if (brand) {
      const data1 = await productModel.find({ brand: brand });
      res.json({ data: data1 });
    } else if (category) {
      const data1 = await productModel.find({ category: category });
      res.json({ data: data1 });
    } else if (title) {
      const data1 = await productModel.find({ title: title });
      res.json({ data: data1 });
    }
  } catch (error) {
    res.json({ err: error.message });
  }
});

productRouter.get("/products/filter", async (req, res) => {
  const { brand, category, price } = req.query;
  try {
    if (brand && price) {
      const data1 = await productModel.find({ price: price, brand: brand });
      res.json({ data: data1 });
    }
    if (brand && category) {
      const data1 = await productModel.find({
        category: category,
        brand: brand,
      });
      res.json({ data: data1 });
    } else if (brand) {
      const data1 = await productModel.find({ brand: brand });
      res.json({ data: data1 });
    } else if (category) {
      const data1 = await productModel.find({ category: category });
      res.json({ data: data1 });
    } else if (price) {
      const data1 = await productModel.find({ price: price });
      res.json({ data: data1 });
    }
  } catch (error) {
    res.json({ err: error.message });
  }
});

productRouter.patch("/update/:productID", async (req, res) => {
  const { productID } = req.params;
  const product = await productModel.find({ _id: productID });
  if (product) {
    let pro = await productModel.findByIdAndUpdate(productID, req.body, {
      new: true,
    });
    pro.save();
    res.send({ msg: "product got updated" });
  } else {
    res.send({ msg: "invalid id" });
  }
});

productRouter.delete("/delete/:productID", async (req, res) => {
  const { productID } = req.params;
  const product = await productModel.find({ _id: productID });
  if (product) {
    let pro = await productModel.deleteOne({ _id: productID });
    res.send({ msg: "product got deleted" });
  } else {
    res.send({ msg: "invalid id" });
  }
});

module.exports = { productRouter };
