$(document).ready(() => {
  $('nav').find('form').on('submit', loginSubmit);
  $('#new-todo').on('submit', newTodo);
  $('.delete-button').on('click', deleteTodo);
  $('#logout').on('click', loggedOut);

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
  <article class="todo rounded">
    <p class="text-base rounded bg-slate-700 m-3 p-4">${safeHtml(todo.description)}</p>
  </article>
`;
  return htmlString;
};

const renderTodos = (todos) => {
  const $container = $('#categories-container');
  for (const todo of todos) {
    $container.find(`#${todo.name}`).show().find('div').prepend(buildTodoCard(todo));
  }
};

const loadTodos = () => {
  $.get('/todos')
    .then(renderTodos);
};

const setNavbar = (name) => {
  if (name) {
    const htmlString =`<p class="align-text">${safeHtml(name)}</p>`;
    $('#login').hide();
    $('#logout').show().find('div').append(htmlString);
    return;
  }
  $('#login').show();
  $('#logout').hide().find('div').text('');
};

// == events ==
const newTodo = function(event) {
  event.preventDefault();
  $(this).trigger('newSubmission');
  // error handling. text field empty
};

const loginSubmit = function(event) {
  event.preventDefault();
  const $form = $(this);
  const $inputField = $form.find('input');

  // error handling
  if (!$inputField.val().trim()) return; // todo send alert

  // login user
  $.post('/users/login', $form.serialize())
    .then((user) => {
      $inputField.val('');
      setNavbar(user.name);
    });
};

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
    });
  $('#logout').hide();
};


const deleteTodo = () => {
  const $todo = $(this).closest('article');
  const id = $todo.id;

  $.delete('/' + id)
    .then(() => {
      $todo.closest('section').removeElement($todo);
    });
};
