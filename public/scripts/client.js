$(document).ready(() => {
  $('#new-todo').on('submit', newTodo);
  $('.delete-button').on('click', deleteTodo);

  // = initial page load =
  loadTodos();
});



const safeHtml = (text) => {
  const safe = document.createElement("div");
  safe.appendChild(document.createTextNode(text));
  return safe.innerHTML;
};


const buildTodoCard = (todo) => {
  const htmlString =  `
    <div class="rounded" style="background-color: #f33aee;">${safeHtml(todo.description)}</div>
    `
    return htmlString;
}

const renderTodos = (todos) => {
  const $container = $('#todo-container');
  for (const todo of todos) {
    $container.find(`#${todo.name}-container`).prepend(buildTodoCard(todo));
  }
}


loadTodos = () => {
  $.get('/todos')
  .then(renderTodos)
};

  // == events ==
  const newTodo = (event) => {
    event.preventDefault();
    const $form = $(this).closest('form');
    $form.find('input').val('');
  }

  const deleteTodo = () => {
    const $todo = $(this).closest('article');
    const id = $todo.id;

    $.delete('/' + id)
      .then(() => {
        $todo.closest('section').removeElement($todo)
      })
  };







