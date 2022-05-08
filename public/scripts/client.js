$(document).ready(() => {
  $('#new-todo').on('submit', callApis);
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
  const htmlString = `
<div class="todo rounded" ">
  <article class="todo rounded flex" style="background-color: #225778;>
    <p class="text-base">
      ${safeHtml(todo.description)}
    </p>
  </article>
</div>
`;
    return htmlString;
}

const renderTodos = (todos) => {
  const $container = $('#categories-container');
  for (const todo of todos) {
    $container.find(`#${todo.name}-container`).show().prepend(buildTodoCard(todo));
  }
}


loadTodos = () => {
  $.get('/todos')
  .then(renderTodos)
};

// == events ==
const newTodo = (event) => {
  event.preventDefault();
  $(this).trigger('apis');
};

const deleteTodo = () => {
  const $todo = $(this).closest('article');
  const id = $todo.id;

  $.delete('/' + id)
    .then(() => {
      $todo.closest('section').removeElement($todo)
    })
};