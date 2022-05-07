$(document).ready(() => {

  // = initial page load =
  loadTodos();


  $('.delete-button').on('click', (event) => {
    event.preventDefault();
    const $todo = $(this).closest('article');
    const id = $todo.id;

    $.delete('/' + id)
      .then(() => {
        $todo.closest('section').removeElement($todo)
      })
  });

  const safeHtml = (string) => {

  }


  const buildTodoCard = (todo) => {
    const htmlString =  `
      <div> ${safeHtml(todo.description)} </div>
      <div> ${todo.category} </div>
      `
      return htmlString;
  }

  renderTodos = (todos) => {
    buildTodoCard(todos[0])
  }

  const loadTodos = (id) => {
    $.get('/todos', id)
    .then(renderTodos)
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
  };

});