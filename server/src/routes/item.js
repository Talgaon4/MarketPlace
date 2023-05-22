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
// Create a new item
router.post("/", verifyToken, async (req, res) => {
  const item = new ItemsModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    cost: req.body.cost,
    district: req.body.district,
    details: req.body.details,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
    userOwner: req.body.userOwner,
    createdAt: Date.now() // Set the current timestamp as createdAt
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
        cost: result.cost,
        details: result.details,
        district: result.district,
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

// Update an item
router.put("/:id", async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;

  try {
    // Update existing item
    const item = await ItemsModel.findByIdAndUpdate(itemId, updatedItem, {
      new: true,
    });
    res.status(200).json(item);
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

router.delete("/users/:userId/:itemId", async (req, res) => {
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
    // Find the item by its _id and remove it
    await ItemsModel.findByIdAndRemove(itemId);

    // Remove the item reference from the user's createdItems array
    const user = await UserModel.findOne({ createdItems: itemId });
    if (user) {
      user.createdItems.pull(itemId);
      await user.save();
    }
    // Remove the item from savedItems of all users
    await UserModel.updateMany(
      { savedItems: itemId },
      { $pull: { savedItems: itemId } }
    );
    res.sendStatus(204); // Send a successful response with no content
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item" });
  }
});

export { router as itemsRouter };
