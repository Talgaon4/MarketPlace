import express from "express";
import mongoose from "mongoose";
import { ItemsModel } from "../models/Items.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const district = req.query.district;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    let query = {};

    if (district) {
      query.district = district;
    }

    if (minPrice && maxPrice) {
      query.cost = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.cost = { $gte: minPrice };
    } else if (maxPrice) {
      query.cost = { $lte: maxPrice };
    }

    const result = await ItemsModel.find(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new item
router.post("/", verifyToken, async (req, res) => {
  const item = new ItemsModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    cost: req.body.cost,
    district: req.body.district,
    details: req.body.details,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
    userOwner: req.body.userOwner,
  });

  try {
    const result = await item.save();

    // Update the createdItems array of the user
    const user = await UserModel.findById(req.body.userOwner);
    user.createdItems.push(result._id);
    await user.save();

    res.status(201).json({
      createdItem: {
        name: result.name,
        image: result.image,
        cost: result.cost,
        details: result.details,
        district: result.district,
        phoneNumber: result.phoneNumber,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get an item by ID
router.get("/:itemId", async (req, res) => {
  try {
    const result = await ItemsModel.findById(req.params.itemId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save an item
router.put("/", async (req, res) => {
  const itemID = req.body.itemID;
  const userID = req.body.userID;
  
  try {
    const user = await UserModel.findById(userID);
    if (user.savedItems.includes(itemID)) {
      // Item already saved, remove it
      user.savedItems.pull(itemID);
    } else {
      // Item not saved, save it
      user.savedItems.push(itemID);
    }
    await user.save();
    res.status(201).json({ savedItems: user.savedItems });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get the IDs of saved items
router.get("/savedItems/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(200).json({ savedItems: user?.savedItems });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved items
router.get("/savedItems/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedItems = await ItemsModel.find({
      _id: { $in: user.savedItems },
    });

    res.status(200).json({ savedItems });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get created items by user ID
router.get("/createdItems/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const createdItems = await ItemsModel.find({
      _id: { $in: user.createdItems },
    });

    res.status(200).json({ createdItems });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as itemsRouter };