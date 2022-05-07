/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getuserByName } = require('../queries');

router.get("/", (req, res) => {
  getUserByName('Jordan')
    .then(user => {
      res.cookie('user', user.id);
      res.json({ user });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;