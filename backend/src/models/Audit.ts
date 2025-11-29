// backend/src/models/Audit.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAudit extends Document {
  assetId: mongoose.Types.ObjectId; // References the Asset model
  auditorId: mongoose.Types.ObjectId; // References the User model (the person performing the audit)
  auditDate: Date;
  physicalLocation: string;
  isVerified: boolean; // Was the asset physically located?
  notes?: string;
}

const AuditSchema: Schema<IAudit> = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    auditorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    auditDate: { type: Date, default: Date.now },
    physicalLocation: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

const Audit = mongoose.model<IAudit>('Audit', AuditSchema);
export default Audit;