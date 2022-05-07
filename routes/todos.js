/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getAllTodos, getUsersTodos: getUserTodos, deleteTodo } = require('../queries');

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM todos`;
    console.log(query);
    db.query(query)
      .then(data => {
        const todos = data.rows;
        res.json({ todos });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};


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
