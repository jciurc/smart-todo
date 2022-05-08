/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
var methodOverride = require('method-override');
const router  = express.Router();
const { getAllTodos, getUserTodos, deleteTodo } = require('../queries');


router.get("/", (req, res) => {
  const user = 1;
  getAllTodos(user || null)
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

//POST todo
router.post("/:id", (req, res) => {
  //const todo = req.body.text
  //const user = cookies.user

  //Update database
  //const category = req.body. catagory //??????????
  //if user is not logged in or if user is not the user from the database return error
});

//Edit todo
router.put("/:id_put", (req, res) => {
  //const todo = req.body.text
  //const user = cookies.user

  //Update database
  //const category = req.body. catagory //??????????
  //if user is not logged in or if user is not the user from the database reurn error
});



router.delete("/:id_delete", {
  //   db.deleteTodos(req.params.id)
})
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
