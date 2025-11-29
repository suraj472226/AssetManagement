import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenance extends Document {
  asset: mongoose.Types.ObjectId; // Link to the Asset Model
  issue: string;
  description?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  cost?: number;
  assignedTo?: string; // e.g., "Tech Support Team"
  scheduledDate?: Date;
  completionDate?: Date;
}

const MaintenanceSchema: Schema = new Schema({
  asset: { 
    type: Schema.Types.ObjectId, 
    ref: 'Asset', 
    required: true 
  },
  issue: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  cost: { type: Number, default: 0 },
  assignedTo: { type: String, default: 'Unassigned' },
  scheduledDate: { type: Date, default: Date.now },
  completionDate: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);