<<<<<<< HEAD
(() => {
  $(document).ready(() => {
    // user routes
    $('nav').find('form').on('submit', loginSubmit);
    $('#logout').on('click', loggedOut);

    // todo routes
    $('#new-todo').on('submit', newTodo);
    $('.delete-button').on('click', deleteTodo);

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
=======
$(document).ready(() => {
  $('.delete-button').on('click', deleteTodo);
  // $('#new-todo').on('submit', newTodo);
>>>>>>> features/api

  const buildTodoCard = (todo) => {
    const htmlString = `
    <article class="todo rounded">
      <p class="text-base rounded bg-slate-700 m-3 p-4" alt="${todo.id}">${safeHtml(todo.description)}</p>
    </article>
  `;
    return htmlString;
  };

<<<<<<< HEAD
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
      const htmlString = `<p class="align-text">${safeHtml(name)}</p>`;
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
    // error handling. text field empty

    $.post('/todos', $(this).serialize());
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
        loadTodos();
      });
  };

  const loggedOut = () => {
    $.post('/users/logout')
      .then((loggedOut) => {
        if (loggedOut) {
          setNavbar(false);
          clearTodos();
        }
      });
  };

  const checkLogin = () => {
    $.get('/users')
      .then((user) => {
        setNavbar(user.name);
      });
  };


  const deleteTodo = () => {
    const $todo = $(this).closest('article');
    const id = $todo.alt;

    $.delete('/' + id)
      .then(() => {
        $todo.closest('section').removeElement($todo);
      });
  };

})();
=======
// == helpers ==
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
>>>>>>> features/api
