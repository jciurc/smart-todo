$(document).ready(() => {
  $('#new-todo').on('submit', newTodo);
  $('.delete-button').on('click', deleteTodo);

  // = initial page load =
  loadTodos();
});

// == helpers ==
const safeHtml = (text) => {
  const safe = document.createElement("div");
  safe.appendChild(document.createTextNode(text));
  return safe.innerHTML;
};

const buildTodoCard = (todo) => {
  const htmlString = `
  <article class="todo rounded flex" style="background-color: #225778;>
    <p class="text-base">${safeHtml(todo.description)}</p>
  </article>
`;
    return htmlString;
}

const renderTodos = (todos) => {
  const $container = $('#categories-container');
  for (const todo of todos) {
    $container.find(`#${todo.name}`).show().find().prepend(buildTodoCard(todo));
  }
}

loadTodos = () => {
  $.get('/todos')
  .then(renderTodos)
};

// == events ==
const newTodo = function(event) {
  event.preventDefault();
  $(this).trigger('apis');
  // error handling. text field empty
};

const deleteTodo = () => {
  const $todo = $(this).closest('article');
  const id = $todo.id;

  $.delete('/' + id)
    .then(() => {
      $todo.closest('section').removeElement($todo)
    })
};