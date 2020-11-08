var express = require('express');
const request = require('./../utils/request');
var router = express.Router();
router.get('/', async function(req, res, next) {
  //删除session中的token
  delete req.session.token;
  return res.redirect('/login')
});
module.exports = router;
