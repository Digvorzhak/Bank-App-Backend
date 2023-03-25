const asyncHandler = require('express-async-handler');
const Account = require('../models/accountModel');
const User = require('../models/userModel');
//@desc Get all accounts
//@route GET /api/v1/accounts
//@access public

const getAllAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find();
  res.status(200).json({ success: true, data: accounts });
});

//@desc Create New Account
//@route POST /api/v1/accounts
//@access public

const createAccount = asyncHandler(async (req, res) => {
  const { cash, credit, owner_id, owner } = req.body;
  if (!cash || !credit || !owner || !owner_id) {
    console.log(cash, credit, owner_id, owner);
    res.status(400);
    throw new Error('Please fill all fields.');
  }
  const account = await Account.create({ cash, credit, owner_id, owner });
  res.status(201).json({ success: true, data: account });
});

//@desc Get an account
//@route GET /api/v1/accounts/:id
//@access public

const getAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    res.status(404);
    throw new Error('Account not found.');
  }

  res.status(200).json({ success: true, data: account });
});

//@desc Update an account
//@route PUT /api/v1/accounts/:id
//@access public

const updateAccount = asyncHandler(async (req, res) => {
  res.status(500);
  const account = await Account.findById(req.params.id);
  if (!account) {
    res.status(404);
    throw new Error('Account not found.');
  }

  const user = await User.findById(account.owner_id);

  if (!user) {
    res.status(404);
    throw new Error('Owner not found!');
  }

  if (user.isActive === false) {
    res.status(403);
    throw new Error('Account is not active. Bank methods are restricted.');
  }

  const updatedAccount = await Account.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({ success: true, data: updatedAccount });
});

//@desc Delete an account
//@route DELETE /api/v1/accounts/:id
//@access public

const deleteAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    res.status(404);
    throw new Error('Account not found.');
  }
  await Account.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, data: account });
});

const transferCash = asyncHandler(async (req, res) => {
  let accountSender = await Account.findById(req.params.id);
  let accountReceiver = await Account.findById(req.body.to);
  if (!accountSender || !accountReceiver) {
    res.status(404);
    throw new Error('One of the accounts is not found.');
  }
  let senderUser = await User.findById(accountSender.owner_id);
  let receiverUser = await User.findById(accountReceiver.owner_id);

  if (!senderUser || !receiverUser) {
    res.status(404);
    throw new Error('One of the users is not found!');
  }

  if (senderUser.isActive === false) {
    res.status(403);
    throw new Error(
      'The account you are trying to receive money from is not active. Bank methods are restricted from that account.'
    );
  }
  if (receiverUser.isActive === false) {
    res.status(403);
    throw new Error(
      'The account you are trying to send money to is not active. Bank methods are restricted from that account.'
    );
  }

  const amount = req.body.amount;

  if (accountSender.cash - amount < accountSender.credit * -1) {
    return res.status(400).json({
      success: false,
      message: 'Not enough credit!',
    });
  } else {
    accountSender = await Account.findByIdAndUpdate(
      req.params.id,
      { $inc: { cash: -amount } },
      { new: true }
    );
    console.log(accountSender);
    accountReceiver = await Account.findByIdAndUpdate(
      req.body.to,
      { $inc: { cash: amount } },
      { new: true }
    );
    console.log(accountReceiver);
    return res.status(200).json({
      success: true,
      data: [accountSender, accountReceiver],
    });
  }
});

module.exports = {
  getAllAccounts,
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  transferCash,
};
