import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true, required: true },
    isGroupChat: { type: String, default: 0 },
    users: [{ type: ObjectId, ref: "User" }],
    groupAdmins: [{ type: ObjectId, ref: "User" }],
    lastMessage: { type: ObjectId, ref: "Message" },
    cloudinary_id: { type: String, trim: true },
    chatDisplayPic: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
