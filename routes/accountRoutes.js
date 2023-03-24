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

router.route('/:id').get(getAccount).put(updateAccount).delete(deleteAccount);

router.route('/transfer/:id').put(transferCash);

module.exports = router;
