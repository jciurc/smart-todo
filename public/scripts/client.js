(() => {
  $(document).ready(() => {
    // user routes
    $('nav').find('form').on('submit', loginSubmit);
    $('#logout').on('click', loggedOut);

    // todo routes
    $('#new-todo').on('submit', newTodo);
    $('button').on('click', deleteTodo);

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
      <p class="text-base rounded bg-slate-700 m-3 p-4" alt="${todo.id}">${safeHtml(todo.description)}</p>
      <button type="button" class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
    </article>
  `;
    return htmlString;
  };

  const renderTodos = (todos) => {
    // need to empty containers first
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
    if (!$(this).find('input').val()) return; // set up alert

    // sends todo text backend
    $.post('/todos', $(this).serialize())

    // get new todo object back
    .this((todo) => {
      if (todo) loadTodos();
    });
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


  const deleteTodo = function() {
    console.log("Todo function");
    const $todo = $(this).closest('article');
    // const id = $todo.attr('alt');
    const id = 3;
    console.log("todo id", id);

    $.ajax({url: '/todos/' + id, type: 'DELETE'})
      .then(() => {
        $todo.closest('section').remove($todo);
      });
  };

})();
