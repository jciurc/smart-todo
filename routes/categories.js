const express = require('express');
const router  = express.Router();
const { getAllCategories } = require('../queries');

router.get("/", (req, res) => {
  getAllCategories()
    .then((cats) => {
      res.json(cats);
    })
    .catch((err) => {
      console.log('error getting categories');
      console.error(err);
    });
});

module.exports = router;
