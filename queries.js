const db = require("./lib/db");

// == users ==
const getUserByName = (name) => {
  return db.query(`SELECT * FROM users WHERE name = $1`, [name])
    .then((res) => {
      return res.rows[0];
    });
};

const getUserById = (id) => {
  return db.query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((res) => {
      return res.rows[0];
    });
};


// == categories ==
const getAllCategories = () => {
  return db.query(`SELECT * FROM categories;`)
    .then((res) => {
      return res.rows;
    });
};

const getCategoryByName = (name) => {
  return db.query(`SELECT * FROM categories WHERE name = $1`, [name])
    .then((res) => {
      return res.rows[0];
    });
};

// stretch getUserTodosByCategory(id, category)

// == todos ==
const getAllTodos = (id = null) => {
  const queryString = `
  SELECT todos.*, name FROM todos
  JOIN categories ON categories.id = category_id
  WHERE user_id = $1
  ORDER BY id;
`;
  return db.query(queryString, [id])
    .then((res) => {
      return res.rows;
    });
};

const editTodo = (todo) => {
  const values = [];
  let queryString = `UPDATE todos `;

  if (todo.category_id) {
    values.push(todo.category_id);
    queryString += `SET category_id = $${values.length} `;
    console.log("queryString after category", queryString);
  }

  if (todo.description) {
    values.push(todo.description);
    queryString += `${values.length >= 1 ? ", " : "SET"} description = $${values.length} `;
    console.log("queryString after description", queryString);
  }

  if (todo.subtitle) {
    values.push(todo.subtitle);
    queryString += `${(values.length >= 1) ? ', ' : 'SET'} subtitle = $${values.length} `;
    console.log("queryString after subtitile", queryString);
  }


  console.log("queryString after all", queryString);
  values.push(todo.id);
  queryString +=
    `WHERE id = $${values.length} RETURNING *;
  `;
  return db.query(queryString, values)
    .then((res) => {
      return res.rows;
    });
};

const setCompleted = (options) => {
  const values = [options.complete, options.id];
  const queryString = `
  UPDATE todos SET completed = $1
  WHERE id = $2
  RETURNING *
`;
  return db.query(queryString, values)
    .then((res) => {
      return res.rows[0];
    });
};

const insertNewTodo = (todo) => {
  const values = [todo.user_id, todo.description, todo.subtitle, todo.category_id];
  const queryString = `
  INSERT INTO todos (user_id, description, subtitle, category_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

  return db.query(queryString, values)
    .then((res) => {
      console.log('new todo inserted:', res.rows);
      return res.rows[0];
    });
};

const deleteTodo = (id) => {
  const values = [id];
  const queryString = `
  DELETE FROM todos
  WHERE id = $1
  `;

  return db.query(queryString, values)
    .then((res) => {
      return true;
    });
};


module.exports = {
  getUserByName,
  getUserById,
  getAllTodos,
  deleteTodo,
  editTodo,
  setCompleted,
  insertNewTodo,
  getCategoryByName,
  getAllCategories,
};
