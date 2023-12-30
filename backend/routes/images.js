const express = require('express');
const router = express.Router();
const {getImage} = require('../controllers/images');

router.get('/:name', getImage);

module.exports = router;