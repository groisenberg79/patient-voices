const express = require('express');
const router = express.Router();
const { searchDiseases } = require('../controllers/diseaseController');

router.get('/search', searchDiseases);

module.exports = router;