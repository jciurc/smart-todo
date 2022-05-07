const db = require("./lib/db");

/// == users ==
const getUserByName = (name) => {
  console.log('running query', name);
  return db.query(`SELECT * FROM users WHERE name = $1;`, [name])
  .then((data) => {
    console.log('returned data', data.rows[0]);
    return data.rows[0];
  })
  .catch((err) => {
    console.error(err);
  })
};

// == todos ==
const getAllTodos = () => {
  return db.query(`SELECT * FROM todos;`)
  .then((data) => {
    return data.rows;
  })
  .catch((err) => {
    console.error(err);
  })
};

const getUserTodos = (id) => {
  const values = [id]
  const queryString = `
  SELECT * FROM todos
  WHERE user_id = $1
  `;

  return db.query(queryString, values)
  .then((data) => {
    return data.rows;
  })
  .catch((err) => {
    console.error(err);
  })
};


// == alters ==
const deleteTodo = (id) => {
  const values = [id]
  const queryString = `
  DELETE FROM todos
  WHERE id = $1
  `;

  return db.query(queryString, values)
  .then((data) => {
    console.log('data from delete', data); // for testing
    return true;
  })
  .catch((err) => {
    console.error(err);
  })
};

// stretch getUserTodosByCategory(id, category)

module.exports = { getUserByName, getAllTodos, getUserTodos, deleteTodo };


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
