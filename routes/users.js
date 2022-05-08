/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getUserByName, getUserById } = require('../queries');

router.get("/", (req, res) => {
  const userId = req.cookie.user;
  if (userId) {
    getUserById(userId)
      .then((user) => {
        res.send(user || null);
      });
  }
  res.send(null);
});

router.post("/logout", (req,res) => {
  res.clearCookie('user');
  res.send(true);
});


router.post("/", (req, res) => {
  const name = req.body.text;

  getUserByName(name)
    .then((user) => {
      return user || addUserToDatabase();
    })
    .then((user) => {
      res.cookie('user', user.id);
      res.json(user);
      console.log(user);
    })

    .catch((err) => {
      res.status(500).json({ error: err.message });
    });


});

module.exports = router;
