import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const ItemsModel = mongoose.model("items", itemSchema);