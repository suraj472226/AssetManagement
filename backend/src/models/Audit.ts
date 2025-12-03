import mongoose, { Document, Schema } from 'mongoose';

export interface IAudit extends Document {
  asset: mongoose.Types.ObjectId;  // Link to the Asset being audited
  performedBy: mongoose.Types.ObjectId; // Link to the User/Admin performing the action
  action: 'Check-In' | 'Check-Out' | 'Audit' | 'Verification'; 
  status: 'Verified' | 'Pending' | 'Missing' | 'Concern';
  location?: string;
  notes?: string;
}

const AuditSchema: Schema = new Schema({
  asset: { 
    type: Schema.Types.ObjectId, 
    ref: 'Asset', 
    required: true 
  },
  performedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { 
    type: String, 
    enum: ['Check-In', 'Check-Out', 'Audit', 'Verification'],
    required: true 
  },
  status: {
    type: String,
    enum: ['Verified', 'Pending', 'Missing', 'Concern'],
    default: 'Verified'
  },
  location: { type: String },
  notes: { type: String }
}, {
  timestamps: true // Automatically adds 'createdAt' (Timestamp)
});

export default mongoose.model<IAudit>('Audit', AuditSchema);