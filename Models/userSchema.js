import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Full name of the user
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique for each user
  },
  password: {
    type: String,
    required: true, // Password for account authentication
  },
  phoneNumber: {
    type: String, // Optional phone number for contact
  },
  token: {
    type: String, // Token for session or authentication
  },
 
});

const User = mongoose.model("User", userSchema);

export default User;
