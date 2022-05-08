$(document).ready(() => {
  $('#new-todo').on('submit', newTodo);
  $('.delete-button').on('click', deleteTodo);
  $('nav').find('form').on('submit', loginSubmit);
  $('#logout').on('click', loggedOut)


  // = initial page load =

checkLogin();

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
    <p class="text-base rounded text-base bg-slate-700 m-5 p-5">${safeHtml(todo.description)}</p>
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

const setNavbar = function(name) {
if(name) {
  $('#login').hide();
  const htmlString = `<p class="align-middle">logged in as ${name} </p>`;
  $('#logout').show().find('div').append(htmlString);
  return;
}
$('#login').show();
  $('#logout').hide().find('div').text('');

};

  const loginSubmit = function(event)  {
   event.preventDefault();

  const $form = $(this);
   const inputText = $form.serialize();

  $.post('/users', inputText)
   .then((user) => {
    $form.find('input').val('');

setNavbar(user.name);
    });

  }

const loggedOut = function() {
$.post('/users/logout')
    .then((loggedOut) => {
      if (loggedOut) {
setNavbar(false);
clearTodos();
      }
});
};

const checkLogin = function() {
  $.get('/users')
    .then((user) => {
setNavbar(user.name);
  })
  $('#logout').hide();
};


const deleteTodo = () => {
  const $todo = $(this).closest('article');
  const id = $todo.id;

  $.delete('/' + id)
    .then(() => {
      $todo.closest('section').removeElement($todo)
    })
};
