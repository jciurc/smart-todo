const express = require('express');
//const methodOverride = require('method-override');
const router  = express.Router();
const { getAllTodos, deleteTodo, insertNewTodo, getCategoryByName, editTodo } = require('../queries');
const { findCategory } = require('../api');
//app.use(methodOverride("'X-HTTP-Method-Override'"));
//app.use(methodOverride('_method'));

router.get("/", (req, res) => {
  const userId = req.cookies.user;
  getAllTodos(userId)
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

      .then((user) => {
      const user_id = req.cookies.user;
      const category_id = user.id;

      // create new todo in database
      insertNewTodo({ user_id, description, category_id })
    })
    .then((todo) => {

      // return new todo back to front end
      res.json(todo || null);
    })
    .catch((err) => {
      console.error(err);
    })
  });
});

//Edit todo
router.put('/:id', (req, res) => {
  console.log("description", req.body.text);
  //const category_id = cat.id;
  const todo_id = req.params.id
  const description = req.body.text;


  editTodo({ description, todo_id }) /*category_id,*/
    .then((data) => {
      res.send(true);
    })
    .catch((err) => {
      console.log(err);
  })
});

// Complete todo
router.patch('/:id', (req, res) => {
  // const user_id = req.params.id
  // const description = req.body.text;
  // const category_id = cat.id;


  // editTodo(description, category_id, user_id)
  //   .then((data) => {
  //     res.send(true);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  // })
});





router.delete("/:id", (req, res) => {
  const id = req.params.id;
  deleteTodo(id)
  .then((data) => {
    res.send(true);
  })
  .catch((err) => {
    console.error(err);
  })
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
