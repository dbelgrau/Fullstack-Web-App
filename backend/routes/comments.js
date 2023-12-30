const express = require('express');
const { getAllComments } = require('../controllers/comments');
const router = express.Router();

router.get('/:id', getAllComments);

module.exports = router;