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
    <div style="background-color: #f33ee;">${safeHtml(todo.description)}</div>
    <div>${todo.category}</div>
    `
    return htmlString;
}

const renderTodos = (todos) => {
  console.log('respooonse', todos);
  console.log('container', $('.px-6 py-4'));
  const $container = $('.px-6 py-4');
  // const $container = $('#todo-container');
  for (const todo of todos) {

    $container.find(`.${todo.category}`).prepend(buildTodoCard(todo));
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

    console.log('');
    const $todo = $(this).closest('article');
    const id = $todo.id;

    $.delete('/' + id)
      .then(() => {
        $todo.closest('section').removeElement($todo)
      })
  };







