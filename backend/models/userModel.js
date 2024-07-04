import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema(
  {
    local: {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
        unique: true,
      },
      mobile: {
        type: String,
        unique: true,
      },
      password: {
        type: String,
      },
    },
    google: {
      googleId: String,
      email: String,
      firstname: String,
      lastname: String,
    },
    facebook: {
      facebookId: String,
      email: String,
      firstname: String,
      lastname: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    address: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPasswordModified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('local.password')) {
      next();
    }
    // Check if the local password field is present and not empty
    if (this.local && this.local.password) {
      // Generate a salt for password hashing
      const salt = await bcrypt.genSalt(10);

      // Hash the password with the generated salt
      this.local.password = await bcrypt.hash(this.local.password, salt);

      // Continue with the save operation
      next();
    } else {
      // If password is missing or empty, proceed without hashing
      next();
    }
  } catch (error) {
    // Handle any errors that occurred during password hashing
    next(error);
  }
});

// Instance method to check if the entered password matches the stored hashed password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  try {
    // Use bcrypt.compare to compare the entered password with the stored hashed password
    return await bcrypt.compare(enteredPassword, this.local.password);
  } catch (error) {
    // Handle any errors that occurred during password comparison
    throw error;
  }
};

export default  mongoose.model('User', userSchema);
