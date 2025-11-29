// backend/src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define UserRole enum for type safety
export type UserRole = 'ADMIN' | 'EMPLOYEE';

// 1. TypeScript Interface for the User Document
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department?: string;
  // Mongoose methods
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// 2. Mongoose Schema Definition
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    // We store the hashed password here
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'EMPLOYEE'],
      default: 'EMPLOYEE',
      required: true,
    },
    department: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// 3. Middleware: Hash the password before saving (on creation/update)
UserSchema.pre('save', async function (next) {
  // Only run if the passwordHash field is being modified
  if (!this.isModified('passwordHash')) {
    return next();
  }
  // The value assigned to passwordHash in the controller is the plain text password here
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// 4. Custom Instance Method: Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  // 'this.passwordHash' refers to the stored hashed password
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// 5. Export the Mongoose Model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;