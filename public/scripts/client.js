(() => {
  $(document).ready(() => {
    // user routes
    $('nav').find('form').on('submit', loginSubmit);
    $('#logout').on('click', loggedOut);

    // todo routes
    $('#new-todo').on('submit', newTodo);
    $('.todo-container').on('click', 'article.todo i.far', editMode);
    $('.todo-container').on('submit', 'form.edit', submitEdit);
    $('.todo-container').on('click', '.form-check-input', completeTodo);
    $('.todo-container').on('click', '.delete-button', deleteTodo);

    // = initial page load =
    checkLogin();
    loadTodos();
  });

  // == helpers ==

  const showAlert = (message, style) => {
    const $alert = $('#alert-box');
    $alert.removeClass("red green").addClass(style);
    $alert.find('.alert-text').text(message);
    $alert.slideDown();
    setTimeout(() => {
      $alert.slideUp();
    }, 6000);
  };


const editMode = function() {
    $('.editing').removeClass('editing');
    const $todo = $(this).closest('article').addClass('editing');
    const $textarea = $todo.find('form').find('[name="text"]').focus();
    const text = $textarea.val();
    $textarea.val('').val(text);
  };


  const safeHtml = (text) => {
    const safe = document.createElement("div");
    safe.appendChild(document.createTextNode(text));
    return safe.innerHTML;
  };

  const buildTodoCard = (todo) => {
    const htmlString = `
    <article class="todo rounded flex-col flex-nowrap justify-center my-2 ring ring-blue-300" completed="${todo.completed}" alt="${todo.id}">
      <header class="card flex justify-center items-center ${todo.completed ? 'complete' : ''} rounded bg-slate-700 h-16 m-3 p-2">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} class="form-check-input hover appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain cursor-pointer" id="flexCheckDefault" />
        <p class="text-base text-center self-center p-2">${safeHtml(todo.description)}</p>
        <i class="far fa-edit hover cursor-pointer"></i>
      </header>

      <form class="edit">
      <label for="text" class="mt-4">Update Todo</label>
        <textarea name="text" class="text-base text-center self-center rounded bg-slate-700 my-2 mx-auto p-2">${safeHtml(todo.description)}</textarea>
        <div class="inline-block text-left">
          <button type="button" name="category" alt="${todo.category_id}" class="inline-flex flex-no-wrap justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-slate-600 text-sm font-medium text-light-700 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="menu-button" aria-expanded="true" aria-haspopup="true">${safeHtml(todo.name)}
            <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg></button></div>
        <textarea name="category" class="text-base rounded w-32 bg-slate-700 m-4 p-1">${safeHtml(todo.name)}</textarea>
        <footer class="pb-4">
          <button type="submit" class="confirm-edit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirm</button>
          <button type="button" class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
        </footer>
      </form>
    </article>
  `;
    return htmlString;
  };

  const renderTodos = (todos) => {
    const $section = $('main').find('#categories-container');
    $section.children('.category').hide().find('.todo-container').empty();
    for (const todo of todos) {
      $section.find(`#${todo.name}`).show().find('.todo-container').prepend(buildTodoCard(todo));
    }
  };

  const loadTodos = () => {
    $.get('/todos')
      .then(renderTodos);
  };

  const renderBasedOnUser = (name) => {
    if (name) {
      $('#login').hide();
      $('#logout').show().find('div').append(`<p class="align-text">${safeHtml(name)}</p>`);
      $('#new-todo').show().find('h1').text(`Hello, ${safeHtml(name)}!`);
      return;
    }
    $('#login').show();
    $('#logout').hide().find('div').text('');
    $('#new-todo').hide().find('h1').text('');
  };

  // == event functions ==
  const newTodo = function(event) {
    event.preventDefault();

    // error handling. text field empty
    if (!$(this).find('input').val()) {
      showAlert('Text field is empty', 'red');
    } else {
      showAlert('New todo added!', 'green');
    }
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
    if (!$inputField.val().trim()) {
      showAlert('Please enter a username', 'red');
    } else {
      showAlert('Logged in', 'green');
    }
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
          renderBasedOnUser(null);
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

  const submitEdit = function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    const id = $(this).closest('article').attr("alt");
    $.ajax({ url: "/todos/" + id, data, type: "PUT" })
      .then((res) => {
        loadTodos();
    })
  };

  const completeTodo = function (event) {
    event.stopPropagation();
    event.preventDefault();
    const $todo = $(this).closest("article");
    const data = 'complete=' + !($todo.attr('completed') === 'true');
    const id = $todo.attr('alt');
    $.ajax({ url: "/todos/" + id, data, type: "PATCH" })
      .then((todo) => {
        loadTodos();
    });
  };

  const deleteTodo = function() {
    const $todo = $(this).closest('article');
    const id = $todo.attr('alt');

    $.ajax({url: '/todos/' + id, type: 'DELETE'})
      .then((res) => {
        loadTodos();
      });
  };
})();
