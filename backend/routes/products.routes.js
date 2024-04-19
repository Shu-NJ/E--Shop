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

productRouter.get("/", (req, res) => {});

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
