const express = require('express');
const router = express.Router();
const { getUserByName, getUserById } = require('../queries');

router.get('/', (req, res) => {
  const userId = req.cookies.user;
  if (!userId) return res.send(null);
  getUserById(userId)
    .then((user) => {
      res.json(user || null);
    });
});

router.post('/login', (req, res) => {
  const name = req.body.text;

  getUserByName(name)
    .then((user) => {
      const current = user || addUserToDatabase();
      res.cookie('user', current.id);
      res.json(current);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

router.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.send('done');
});

module.exports = router;
