import mongoose from "mongoose";
const Schema = mongoose.Schema;

const passwordResetTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
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

export default  mongoose.model("PasswordResetToken", passwordResetTokenSchema);
