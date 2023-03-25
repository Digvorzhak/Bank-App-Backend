const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

//@desc Get all users
//@route GET /api/v1/users
//@access public

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('accounts');
  if (users.length === 0) {
    res.status(400);
    throw new Error('No users!');
  }
  res.status(200).json({ success: true, data: users });
});

//@desc Create New user
//@route POST /api/v1/users
//@access public

const createUser = asyncHandler(async (req, res) => {
  const { name, email, accounts, isActive } = req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error('Please fill all fields.');
  }
  console.log(accounts);
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error('User already registered!');
  }
  let activeAccount = isActive === false ? isActive : true;
  let userAccounts = accounts ? accounts : [];
  res.status(403);
  const user = await User.create({
    name,
    email,
    accounts: userAccounts,
    isActive: activeAccount,
  });
  res.status(201).json({ success: true, data: user });
});

//@desc Get a user
//@route GET /api/v1/users/:id
//@access public

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('accounts');
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  res.status(200).json({ success: true, data: user });
});

//@desc Update a user
//@route PUT /api/v1/users/:id
//@access public

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, data: updatedUser });
});

//@desc Delete a user
//@route DELETE /api/v1/users/:id
//@access public
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: user });
});

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
