(() => {
  $(document).ready(() => {
    // user routes
    $('nav').find('form').on('submit', loginSubmit);
    $('#logout').on('click', loggedOut);

    // todo routes
    $('#new-todo').on('submit', newTodo);
    $('.todo-container').on('click', 'article', editMode);
    $('.todo-container').on('click', '.delete-button', deleteTodo);
    $('.todo-container').on('submit', 'form', editTodo);



    // = initial page load =
    checkLogin();
    loadTodos();
  });

  // == helpers ==
  const editMode = function() {
    const $todo = $(this);
    $todo.find('form').show();
  };

  const safeHtml = (text) => {
    const safe = document.createElement("div");
    safe.appendChild(document.createTextNode(text));
    return safe.innerHTML;
  };

  const buildTodoCard = (todo) => {
    const htmlString = `
    <article class="todo rounded" alt="${todo.id}">
      <p class="text-base rounded bg-slate-700 m-3 p-4">${safeHtml(todo.description)}</p>

<form hidden>

        <textarea name="text" class="text-base rounded bg-slate-700 m-3 p-4">${safeHtml(todo.description)}</textarea>
        <button type="submit" class="confirm-edit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirm</button>
        <button type="button" class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
</form>
    </article>
  `;
    return htmlString;
  };

  const renderTodos = (todos) => {
    // need to empty containers first
    const $container = $('#categories-container');
    $container.find('.todo-container').hide().find('div').empty();
    for (const todo of todos) {
      $container.find(`#${todo.name}`).show().find('div').prepend(buildTodoCard(todo));
    }
  };

  const loadTodos = () => {
    $.get('/todos')
      .then(renderTodos);
  };

  const renderBasedOnUser = (name) => {
    if (name) {
      const htmlString = `<p class="align-text">${safeHtml(name)}</p>`;
      $('#login').hide();
      $('#logout').show().find('div').append(htmlString);
      $('#new-todo').show().find('h1').text(`Hello, ${name}!`);
      return;
    }
    $('#login').show();
    $('#logout').hide().find('div').text('');
    $('#new-todo').hide().find('h1').text('');
  };

  // == events ==
  const newTodo = function(event) {
    event.preventDefault();

    // error handling. text field empty
    if (!$(this).find('input').val()) return; // set up alert

    // sends todo text backend
    $.post('/todos', $(this).serialize())
    // get new todo object back
    .then((todo) => {
      $(this).find('input').val('');
      loadTodos();
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
        renderBasedOnUser(user.name);
        loadTodos();
      });
  };

  const loggedOut = () => {
    $.post('/users/logout')
      .then((loggedOut) => {
        if (loggedOut) {
          renderBasedOnUser(false);
          loadTodos();
        }
      });
  };


  const checkLogin = () => {
    $.get('/users')
      .then((user) => {
        renderBasedOnUser(user.name);
      });
  };

  const editTodo = function (event) {
    event.preventDefault();
    const $todo = $(this).closest('article');
    const text = $(this).serialize()
    console.log('serialized text', text);
    //maybe second input parameter?
    const id = $todo.attr("alt");id

    $.ajax({ url: "/todos/" + id, data: text, type: "PUT" })
      .then((res) => {
        loadTodos();
    })
  }


  const deleteTodo = function() {
    const $todo = $(this).closest('article');
    const id = $todo.attr('alt');

    $.ajax({url: '/todos/' + id, type: 'DELETE'})
      .then(() => {
        $todo.remove();
      });
  };

})();
