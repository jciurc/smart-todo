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
    $('.editing').removeClass('editing ring');
    const $todo = $(this).closest('article').addClass('editing ring');
    const $textarea = $todo.find('form').find('[name="text"]').focus();
    const text = $textarea.val();
    $textarea.val('').val(text);
  };

  const safeHtml = (text) => {
    const safe = document.createElement("div");
    safe.appendChild(document.createTextNode(text));
    return safe.innerHTML;
  };

  const buildTodoCard = (todo, options) => {
    const htmlString = `
<article class="todo rounded flex-col flex-nowrap justify-center my-2 ring-blue-300" completed="${todo.completed}" alt="${todo.id}">
  <header class="card flex justify-center items-center ${todo.completed ? 'complete' : ''} rounded bg-slate-700 h-16 m-3 p-2">
    <input type="checkbox" ${todo.completed ? 'checked' : ''} class="form-check-input hover appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain cursor-pointer" id="flexCheckDefault" />
    <p class="text-base text-center self-center p-2">${safeHtml(todo.description)}</p>
    <i class="far fa-edit hover cursor-pointer"></i>
  </header>

  <form class="edit">
  <header class="m-2 pt-2">
      <label for="text" class="text-center"">Update Todo</label><i class="far fa-close cursor-pointer m-1" style="position: absolute; right: 4px;"></i></header>
      <textarea name="text" class="text-base text-center self-center rounded bg-slate-600 my-2 mx-auto p-2">${safeHtml(todo.description)}</textarea>
      <select name="category_id" class="text-base rounded w-28 bg-slate-600 m-3 ">${safeHtml(todo.name)}">
        ${options}
        </select>
    <footer class="flex justify-around pb-4">
      <button type="submit" class="confirm-edit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirm</button>
      <button type="button" class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
    </footer>
  </form>
</article>
  `;
    return htmlString;
  };


  const buildList = (list) => {
    let options = '';
    for (const item of list) {
      options += `\n<option value="${item.id}">${safeHtml(item.name)}</option> `
    }
    return options;
  };


  const loadCategories = () => {
    return $.get('/categories')
      .then(buildList)
  };

  const renderTodos = (todos) => {
    loadCategories()
      .then((categories) => {
        const $section = $('main').find('#categories-container');
        $section.children('.category').hide().find('.todo-container').empty();
        for (const todo of todos) {
          $section.find(`#${todo.name}`).show().find('.todo-container').prepend(buildTodoCard(todo, categories));
        }
      });
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
    if (!$inputField.val().trim()) return showAlert('Please enter a username', 'red');
    showAlert('Logged in', 'green');

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
