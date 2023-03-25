const express = require('express');
const router = express.Router();
const {
  getAllAccounts,
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  transferCash,
} = require('../controllers/accountController');

router.route('/').get(getAllAccounts).post(createAccount);

router.route('/transfer/:id').put(transferCash);

router.route('/:id').get(getAccount).put(updateAccount).delete(deleteAccount);

module.exports = router;
