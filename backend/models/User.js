const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    dob: {
      type: Date,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
      },
    ],
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  { timestamps: true }
);

userSchema.post('findOneAndDelete', async function (user) {
  if (user) {
    try {
      if (user.posts && user.posts.length > 0) {
        await mongoose.model('Post').deleteMany({ _id: { $in: user.posts } });
      }
      if (user.notes && user.notes.length > 0) {
        await mongoose.model('Note').deleteMany({ _id: { $in: user.notes } });
      }
      if (user.contacts && user.contacts.length > 0) {
        await mongoose.model('Contact').deleteMany({ _id: { $in: user.contacts } });
      }
    } catch (error) {
      console.error('Error deleting related data:', error);
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;