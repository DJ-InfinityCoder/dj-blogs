import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  
  provider: { type: String, enum: ["credentials", "google", "github"], default: "credentials" },
  providerId: { type: String }, 
  name: { type: String },
  image: { type: String },
  emailVerified: { type: Boolean, default: false },

});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
