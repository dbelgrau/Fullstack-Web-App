const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig');
const {getAllUsers, addUser, getOneUser, modifyUser, deleteUser, generateAdminCode, login, logout, verifyUser, banUser, unbanUser} = require('../controllers/users');

// router.get('/adminCode', generateAdminCode);

router.get('/', getAllUsers);

router.get('/:uid', getOneUser);

router.post('/', upload.single('image'), addUser);

router.put('/:uid', upload.single('image'), modifyUser);

router.delete('/:uid', deleteUser);

router.patch('/ban', banUser);

router.patch('/unban', unbanUser);

router.post('/login', login);

router.post('/verify', verifyUser);

router.post('/logout', logout);


module.exports = router;
