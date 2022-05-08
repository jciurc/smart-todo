const express = require('express');
//const methodOverride = require('method-override');
const router  = express.Router();
const { getAllTodos, deleteTodo, insertNewTodo, getCategoryByName } = require('../queries');
const { findCategory } = require('../api');
//app.use(methodOverride("'X-HTTP-Method-Override'"));
//app.use(methodOverride('_method'));

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

router.post('/', (req, res) => {
  const description = req.body.text;
  // get category from external apis
  findCategory(description)
    .then((category) => {
      return getCategoryByName(category)

      .then((cat) => {
      const user_id = req.cookies.user;
      const category_id = cat.id;

      // create new todo in database
      insertNewTodo({ user_id, description, category_id })
    })
    .then((todo) => {

      // return new todo back to front end
      res.json(todo || null);
    })
    .catch((err) => {

    })
  });
});

//Edit todo
// router.post('/:id') {
//   const todoId = req.params.id
//   const newTodo = req.body.text;
//   const category = req.body.category;
//   const userId = req.cookie.user
// })




router.delete("/:id", (req, res) => {
  //   db.deleteTodos(req.params.id)
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
