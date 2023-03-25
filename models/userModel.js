const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: [true, 'Name is required!'],
    // ref: 'User',
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  isActive: {
    type: Boolean,
  },
});

module.exports = mongoose.model('User', userSchema);
