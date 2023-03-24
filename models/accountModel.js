const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  owner: {
    type: String,
    required: [true, 'Owner is required!'],
    // ref: 'User',
  },
  cash: {
    type: Number,
    required: [true, 'Cash is required!'],
  },
  credit: {
    type: Number,
    required: [true, 'Credit is required!'],
  },
});

module.exports = mongoose.model('Account', accountSchema);
