import mongoose, { Schema, Document } from "mongoose";

export interface IFood extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  type: "veg" | "non-veg";
  restaurant: string;
  rating: number;
}

const FoodSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ["veg", "non-veg"], required: true },
    restaurant: { type: String, required: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Food || mongoose.model<IFood>("Food", FoodSchema);
