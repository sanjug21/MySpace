const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    personal: {
      type: String,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    work: {
      type: String,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  phone: {
    personal: {
      type: String,
      trim: true,
    },
    work: {
      type: String,
      trim: true,
    },
  },
  address: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
  },
}, { timestamps: true }); 

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;