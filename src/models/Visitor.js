import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  ipAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
