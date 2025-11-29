import mongoose, { Document, Schema } from 'mongoose';

export interface IRequest extends Document {
  requestedBy: mongoose.Schema.Types.ObjectId;
  specificAsset?: mongoose.Schema.Types.ObjectId; // <-- ADDED: Links to a specific asset if requested
  employeeName: string;
  department: string;
  assetType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestID: string;
}

const RequestSchema: Schema = new Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  specificAsset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', optional: true }, // <-- ADDED
  employeeName: { type: String, required: true },
  department: { type: String, required: true },
  assetType: { type: String, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestID: { type: String, required: true, unique: true },
}, {
  timestamps: true
});

export default mongoose.model<IRequest>('Request', RequestSchema);