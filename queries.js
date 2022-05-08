const db = require("./lib/db");

// == users ==
const getUserByName = (name) => {
  return db.query(`SELECT * FROM users WHERE name = $1`, [name])
  .then((data) => {
    return data.rows[0];
  })
  .catch((err) => {
    console.error(err);
  })
};

const getUserById = (id) => {
  return db.query(`SELECT * FROM users WHERE id = $1`, [id])
  .then((data) => {
    return data.rows[0];
  })
  .catch((err) => {
    console.error(err);
  })
};

// == todos ==
const getAllTodos = (id) => {
  const queryParams = [`
  SELECT todos.*, name FROM todos
  JOIN categories ON categories.id = category_id
  ${id ? 'WHERE user_id = $1' : ''}
`];
  if (id) queryParams.push([id]);

  return db.query(...queryParams)
  .then((data) => {
    return data.rows;
  })
  .catch((err) => {
    console.error(err);
  })
};

// == alters ==
const editTodo = (todo) => {
  const values = [];
  const queryString = `UPDATE todos`

  if (todo.description) {
    values.push(`${todos.description}`)
    queryString += `SET description = $${values.length},`;
  }
  if (todos.catagory_id) {
    values.push(`${todo.category_id}`)
    queryString += `catagory_id = $${values.length}`
  }
  `WHERE user_id = $${todo.user_id} RETURNING *;`;
  return db.query(queryString, values)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.error(err);
    });
};


const setCompleted = (id, isComplete) => {
  const values = [id, isComplete]
  const queryString = `
  UPDATE todos SET completed = $1
  WHERE id = $2
  RETURNING *
`;

  return db.query(queryString, values)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.error(err);
    });
};

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

module.exports = { getUserByName, getUserById, getAllTodos, deleteTodo, editTodo, setCompleted };



// const editCategory = () => {
//   const queryString = `INSERT INTO catagories (name) VALUES ()`
//   const values = [];
//   return db.query(queryString, values)
//     .then((data) => {
//       return data.rows;
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
//
// const editcompleted = () => {
//   const queryString = `INSERT INTO todos (completed) VALUES ( true)`;
//   const values = [];
//   return db
//     .query(queryString, values)
//     .then((data) => {
//       return data.rows;
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
//
//
