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

const getCategoryByName = (category) => {
  return db.query(`SELECT * FROM categories WHERE category = $1`, [category])
    .then((res) => {
      return res.rows[0];
    });
};

// stretch getUserTodosByCategory(id, category)

// == todos ==
const getAllTodos = (id = null) => {
  const queryString = `
  SELECT todos.*, category FROM todos
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
  const values = [todo.category_id];
  let queryString = `UPDATE todos
  SET category_id = $1 `;

  if (todo.title) {
    values.push(todo.title);
    queryString += `, title = $${values.length} `;
  }
  if (todo.description) {
    values.push(todo.description);
    queryString += `, description = $${values.length} `;
  }

  values.push(todo.id);
  queryString +=
    `WHERE id = $${values.length}
    RETURNING *, (SELECT category FROM categories WHERE id = $1);
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
  WHERE todos.id = $2
  RETURNING *
`;
  return db.query(queryString, values)
    .then((res) => {
      return res.rows[0];
    });
};

const insertNewTodo = (todo) => {
  const values = [todo.user_id, todo.title, todo.description, todo.category_id];
  const queryString = `
  INSERT INTO todos (user_id, title, description, category_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *, (SELECT category FROM categories WHERE id = $4);
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
