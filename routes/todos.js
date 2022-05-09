const express = require('express');
//const methodOverride = require('method-override');
const router  = express.Router();
const { getAllTodos, deleteTodo, insertNewTodo, getCategoryByName, editTodo, setCompleted } = require('../queries');
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
      console.log('category found:', category);
      return getCategoryByName(category)
        .then((cat) => {
          const user_id = req.cookies.user;
          const category_id = cat.id;

          // create new todo in database
          insertNewTodo({ user_id, description, category_id });
        })
        .then((todo) => {

          // return new todo back to front end
          res.json(todo || null);
    })
    .catch((err) => {
      console.log('error posting new todo');
      console.error(err);
    })
  });
});

//Edit todo
router.put('/:id', (req, res) => {
  const id = req.params.id
  const description = req.body.text;
  const category = req.body.category;

  console.log('req body', req.body);

  return getCategoryByName(category)
  .then((cat) => {
    const category_id = cat ? cat.id : null;
    editTodo({ id, description, category_id })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });




});

// Complete todo
router.patch('/:id', (req, res) => {
  const todo_id = req.params.id;
  const complete = req.body.complete;
  ///???????? boolean true or faulse response
  console.log(" complte string", req.body.complete);
  setCompleted({todo_id, complete})
    .then((data) => {
      res.send(true);
    })
    .catch((err) => {
      console.log(err);
  })
});





router.delete("/:id", (req, res) => {
  const id = req.params.id;
  deleteTodo(id)
  .then((data) => {
    res.send(true);
  })
  .catch((err) => {
    console.log('error deleting todo');
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
