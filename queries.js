const db = require('./lib/db');

/// == users ==
// getUserById(id)

// == todos ==
const getAllTodos = () => {
  db.query("GET * FROM todos;")
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getUserTodos = (id) => {
  const values = [id]
  const queryString = `
  GET * FROM todos
  WHERE user_id = $1
  `;

  db.query(queryString, values)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.error(err);
    });
};


// == alters ==
const deleteTodo = (id) => {
  const values = [id]
  const queryString = `
  DELETE FROM todos
  WHERE id = $1
  `;

  db.query(queryString, values)
    .then((data) => {
      console.log("data from delete", data); // for testing
      return true;
    })
    .catch((err) => {
      console.error(err);
    });
};

// stretch getUserTodosByCategory(id, category)

module.exports = { getAllTodos, getUsersTodos: getUserTodos, deleteTodo };


// -boilerplate code-
// db.query(`SELECT * FROM users;`)
//       .then(data => {
//         const users = data.rows;
//         res.json({ users });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
// -end boilerplate-
