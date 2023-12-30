const express = require('express');
const router = express.Router();
const upload = require('../config/multerconfig');
const { checkRole } = require('../middleware/middleware');
const { exportMemesToCsv, exportUsersToCsv, exportCypher, importCypher, exportAllCSV } = require('../controllers/database');

router.get('/memes', checkRole, exportMemesToCsv);

router.get('/users', checkRole, exportUsersToCsv);

router.get('/csv', checkRole, exportAllCSV);

router.get('/cypher', checkRole, exportCypher);

router.post('/import', checkRole, upload.single('file'), importCypher);

module.exports = router;