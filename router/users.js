
const express = require('express');
const router = express.Router();
const {  newletter, user, all_users, login, signup, userByEmail, userByID, updateProfile, deleteUser} = require('../controller/users');

router.get('/user', user);
router.get('/all-users', all_users);
router.get('/user-by-email', userByEmail);
router.get('/user-by-id/:id', userByID);

router.post('/login', login);
router.post('/signup', signup);
router.post('/newletter', newletter);

module.exports = router;
