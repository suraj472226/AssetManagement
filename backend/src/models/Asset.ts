// backend/src/models/Asset.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  assetID: string;
  serialNumber: string; // This field was missing from the controller/frontend
  name: string;
  category: string;
  status: 'in-use' | 'available' | 'maintenance' | 'retired'; // Enum values must match frontend
  purchaseDate?: Date;
  cost?: number;
  location?: string;
  department?: string;
  warrantyEnd?: Date;
  currentOwner?: string;
}

const AssetSchema: Schema = new Schema({
  assetID: { type: String, required: true, unique: true, trim: true },
  serialNumber: { type: String, required: true, unique: true, trim: true }, // Ensure this is required
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  
  // --- CORRECTED THIS PART ---
  // The enum values must be lowercase to match what the frontend sends.
  status: {
    type: String,
    required: true,
    enum: ['in-use', 'available', 'maintenance', 'retired'], 
  },
  // --- END CORRECTION ---

  purchaseDate: { type: Date },
  cost: { type: Number },
  location: { type: String, trim: true },
  department: { type: String, trim: true },
  warrantyEnd: { type: Date },
  currentOwner: { type: String, trim: true },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

export default mongoose.model<IAsset>('Asset', AssetSchema);