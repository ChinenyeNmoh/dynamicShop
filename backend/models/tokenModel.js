import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
    },
    token: { 
        type: String,
        required: true 
    },
    expireAt: { 
        type: Date,
        expires: 48 * 60 * 60,
        index: true, 
        default: Date.now,
    }
});

export default  mongoose.model("Token", tokenSchema);
