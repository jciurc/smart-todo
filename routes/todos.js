const express = require('express');
const router  = express.Router();
const { getAllTodos, deleteTodo } = require('../queries');

router.get("/", (req, res) => {
  const userId = req.cookies.user;
  getAllTodos(userId || null)
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

//Edit todo
router.post('/:id');

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
