const asyncHandler = require('express-async-handler');
const Account = require('../models/accountModel');
//@desc Get all accounts
//@route GET /api/v1/accounts
//@access public

const getAllAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find();
  res.status(200).json(accounts);
});

//@desc Create New Account
//@route POST /api/v1/accounts
//@access public

const createAccount = asyncHandler(async (req, res) => {
  const { cash, credit, owner } = req.body;
  if (!cash || !credit || !owner) {
    res.status(400);
    throw new Error('Please fill all fields.');
  }
  const account = await Account.create({ cash, credit, owner });
  res.status(201).json(account);
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
  res.status(200).json(account);
});

//@desc Update an account
//@route PUT /api/v1/accounts/:id
//@access public

const updateAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    res.status(404);
    throw new Error('Account not found.');
  }

  const updatedAccount = await Account.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedAccount);
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
  res.status(200).json(account);
});

const transferCash = asyncHandler(async (req, res) => {
  let accountSender = await Account.findById(req.params.id);
  if (!accountSender) {
    res.status(404);
    throw new Error('Account not found.');
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
    const accountReceiver = await Account.findByIdAndUpdate(
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
