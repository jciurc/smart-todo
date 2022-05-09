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
const getAllTodos = (id = null) => {
  const queryString = `
  SELECT todos.*, name FROM todos
  JOIN categories ON categories.id = category_id
  WHERE user_id = $1
`;
  return db.query(queryString, [id])
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
  console.log("todo", todo);
  let queryString = `UPDATE todos `

  if (todo.description) {
    values.push(`${todo.description}`)
    queryString += `SET description = $${values.length}
    ${todo.category ? ', ' : ''}
    `
  }


  if (todo.category_id) {
    values.push(`${todo.category_id}`)
    queryString += `category_id = $${values.length} `
  }

  values.push(todo.todo_id);
  queryString +=
    `WHERE id = $${values.length} RETURNING *;
  `;
  console.log("values", values);
  console.log("query string", queryString);
  return db.query(queryString, values)
    .then((data) => {
      console.log(" I'm here");
      return data.rows;
    })
    .catch((err) => {
      console.error(err);
    });
};


const setCompleted = (options) => {
  console.log("complete in query", options);
  const values = [options.complete, options.id];
  
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


const getCategoryByName = (name) => {
  return db.query(`SELECT id FROM categories WHERE name = $1`, [name])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.error(err);
    });
}


const insertNewTodo = (todo) => {
  const values = [todo.user_id, todo.description, todo.category_id];
  const queryString = `
  INSERT INTO todos (user_id, description, category_id)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

  return db.query(queryString, values)
    .then((data) => {
      console.log('new todo inserted:', data.rows );
      return data.rows[0];
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
    return true;
  })
  .catch((err) => {
    console.error(err);
  })
};

// stretch getUserTodosByCategory(id, category)

module.exports = { getUserByName, getUserById, getAllTodos, deleteTodo, editTodo, setCompleted, insertNewTodo, getCategoryByName };
