/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getAllTodos, getUserTodos, deleteTodo } = require('../queries');

router.get("/", (req, res) => {
  getAllTodos()
    .then((todos) => {
      res.json({todos});
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;



// .get('/') {
//   db.getAllTodos()
//   app.then((todos) => {
//     renderTodos(todos)
//   })
// }

// .delete('/:id') {
//   db.deleteTodos(req.params.id)
// }
// .get('/') {
//   db.getAllTodos()
// }
// .get('/') {
//   db.getAllTodos()
// }
