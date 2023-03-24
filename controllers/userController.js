const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

//@desc Get all users
//@route GET /api/v1/users
//@access public

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users.length === 0) {
    res.status(400);
    throw new Error('No users!');
  }
  res.status(200).json(users);
});

//@desc Create New user
//@route POST /api/v1/users
//@access public

const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error('Please fill all fields.');
  }
  const user = await User.create({ name, email, accounts: [] });
  res.status(201).json(user);
});

//@desc Get a user
//@route GET /api/v1/users/:id
//@access public

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  res.status(200).json(user);
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
  res.status(200).json(updatedUser);
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
  res.status(200).json(user);
});

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
