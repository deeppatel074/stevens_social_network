const express = require('express');
const router = express.Router();
const data = require('../data');

router.get('/', (req, res) => {
  res.render('pages/login', {});
});

router.get('/signup', (req, res) => { 
  res.render('pages/signup', {});
});

module.exports = router;