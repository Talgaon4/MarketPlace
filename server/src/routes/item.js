import express from "express";
import mongoose from "mongoose";
import { ItemsModel } from "../models/Items.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/itemsSearch", async (req, res) => {
  try {
    const district = req.query.district;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const category = req.query.category;

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

    if (category) {
      query.category = category;
    }

    const result = await ItemsModel.find(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let query = {};

    const result = await ItemsModel.find(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new item
router.post("/createItem", verifyToken, async (req, res) => {
  const item = new ItemsModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    cost: req.body.cost,
    district: req.body.district,
    details: req.body.details,
    category: req.body.category,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
    userOwner: req.body.userOwner,
    createdAt: Date.now(),
  });

  try {
    const result = await item.save();

    const user = await UserModel.findById(req.body.userOwner);
    user.createdItems.push(result._id);
    await user.save();

    res.status(201).json({
      createdItem: {
        name: result.name,
        cost: result.cost,
        details: result.details,
        district: result.district,
        category: result.category,
        phoneNumber: result.phoneNumber,
        imageUrl: result.imageUrl,
        userOwner: result.userOwner,
        createdAt: result.createdAt,
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
router.put("/saveItem", async (req, res) => {
  const itemID = req.body.itemID;
  const userID = req.body.userID;

  try {
    const user = await UserModel.findById(userID);
    if (user.savedItems.includes(itemID)) {
      user.savedItems.pull(itemID);
    } else {
      user.savedItems.push(itemID);
    }
    await user.save();
    res.status(201).json({ savedItems: user.savedItems });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update an item
router.put("/:id", async (req, res) => {
  const itemId = req.params.id;
  const { createdAt, ...updatedItem } = req.body; // Exclude createdAt field from the update
  try {
    const item = await ItemsModel.findByIdAndUpdate(itemId, updatedItem, {
      new: true,
      runValidators: true, // Validate the updated item against the schema
      omitUndefined: true, // Exclude undefined fields from the update
    });
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get the IDs of saved items
router.get("/savedItems/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(200).json({ savedItems: user?.savedItems });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get created items by user ID
router.get("/createdItems/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);

    if (user.isAdmin) {
      const createdItems = await ItemsModel.find({});
      res.status(200).json({ createdItems });
    } else {
      const createdItems = await ItemsModel.find({
        _id: { $in: user.createdItems },
      });
      res.status(200).json({ createdItems });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/cancelSave", async (req, res) => {
  console.log(req.params.userId, req.params.itemId);
  res.json({ user: req.params.userId });

  const userId = req.params.userId;
  const itemId = req.params.itemId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedItemIndex = user.savedItems.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (savedItemIndex !== -1) {
      user.savedItems.splice(savedItemIndex, 1);
      await user.save();
      res.status(200).json({ message: "Item removed from saved items" });
    } else {
      res.status(404).json({ error: "Item not found in saved items" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while removing the item" });
  }
});

router.delete("/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    await ItemsModel.findByIdAndRemove(itemId);

    const user = await UserModel.findOne({ createdItems: itemId });
    if (user) {
      user.createdItems.pull(itemId);
      await user.save();
    }

    await UserModel.updateMany(
      { savedItems: itemId },
      { $pull: { savedItems: itemId } }
    );
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item" });
  }
});

export { router as itemsRouter };
