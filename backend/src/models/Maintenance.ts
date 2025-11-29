// backend/src/models/Maintenance.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenance extends Document {
  assetId: mongoose.Types.ObjectId; // References the Asset model
  type: 'Scheduled' | 'Unscheduled' | 'Upgrade';
  description: string;
  dateScheduled: Date;
  dateCompleted?: Date;
  cost: number;
  performedBy: string; // User ID or external vendor
}

const MaintenanceSchema: Schema<IMaintenance> = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    type: { type: String, enum: ['Scheduled', 'Unscheduled', 'Upgrade'], required: true },
    description: { type: String, required: true },
    dateScheduled: { type: Date, required: true },
    dateCompleted: { type: Date },
    cost: { type: Number, default: 0 },
    performedBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Maintenance = mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
export default Maintenance;