(() => {
  $(document).ready(() => {
    // user routes
    $('nav').find('form').on('submit', loginSubmit);
    $('#logout').on('click', loggedOut);

    // todo routes
    $('#new-todo').on('submit', newTodo);
    $('.todo-container').on('click', 'article.todo i.fa-edit', editMode);
    $('.todo-container').on('submit', 'form.edit', submitEdit);
    $('.todo-container').on('click', '.check-complete', completeTodo);
    $('.todo-container').on('click', '.delete-button', deleteTodo);

    // close editor
    $('.todo-container').on('click', 'header > .fa-solid', () => {
      $('.editing').removeClass('editing ring');
    });

    // = initial page load =
    checkLogin();
    loadTodos();

    // offset page rendering
    setTimeout(() => {
      $('body > #delay').show();
    }, 10);
  });

  // == helpers ==
  const getGreeting = (hours) => {
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const showAlert = (message, style) => {
    const $alert = $('#alert-box');
    $alert.removeClass("success warning bad").addClass(style);
    $alert.find('.alert-text').text('').append(message);
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

  const buildTodoCard = (todo, dropdownOptions) => {
    // move current category to top of dropdown list
    const sorted = [...dropdownOptions];
    const [current] = sorted.splice(sorted.findIndex(item => item.includes('value="' + todo.category_id)), 1);
    sorted.unshift(current);

    const htmlString = `
<article class="todo rounded flex-col flex-nowrap justify-center my-2 ring-blue-300" completed="${todo.completed}" alt="${todo.id}">
  <header class="card flex justify-center items-center ${todo.completed ? 'complete' : ''} rounded bg-slate-700 m-3 p-2">
    <i type="button" ${todo.completed ? 'checked' : ''} class="check-complete hover cursor-pointer fa-solid fa-circle${todo.completed ? '-check' : ''}" id="flexCheckDefault" ></i>
    <div>
    <p class="description text-base text-center self-center p-2">${safeHtml(todo.description)}</p>
    <p class="subtitle text-base text-center">${safeHtml(todo.subtitle)}</p>
    </div>
    <i class="far fa-edit hover cursor-pointer"></i>
  </header>

  <form class="edit">
    <header class="m-2">
      <label for="text" class="text-center"">Update Todo</label><i class="fa-solid fa-xmark cursor-pointer m-1"></i>
    </header>
    <textarea name="text" class="text-base text-center self-center rounded bg-slate-800 my-2 mx-auto p-2">${safeHtml(todo.description)}</textarea>
    <select name="category_id" class="text-base rounded bg-slate-800 m-30">
        ${sorted.join('\n')}
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

  const buildCategories = () => {
    return $.get('/categories')
      .then((categories) => {
        return categories.map((item) => `<option value="${item.id}">${safeHtml(item.name)}</option>`);
      });
  };

  const renderTodos = (todos) => {
    buildCategories()
      .then((categories) => {
        const $section = $('main').find('#categories-container');
        $section.children('.category').hide().find('.todo-container').empty();
        for (const todo of todos) {
          $section.find(`#${todo.name}`).show().find('.todo-container').prepend(buildTodoCard(todo, categories)).fadeIn(999);
        }
      });
  };

  const loadTodos = () => {
    $.get('/todos')
      .then(renderTodos);
  };

  const renderBasedOnUser = (name) => {
    const currentHours = new Date().getHours();
    if (name) {
      $('#login').hide();
      $('#logout').show().find('div').append(`<p class="align-text">${safeHtml(name)}</p>`);
      $('#splash').hide();
      $('#new-todo').show().find('h1').text(`${getGreeting(currentHours)}, ${safeHtml(name)}!`);
      return;
    }
    $('#login').show();
    $('#splash').show();
    $('#logout').hide().find('div').text('');
    $('#new-todo').hide().find('h1').text('');
  };


  // == event functions ==
  // = user events =
  const checkLogin = () => {
    $.get('/users')
      .then((user) => {
        renderBasedOnUser(user.name);
      });
  };

  const loginSubmit = function(event) {
    event.preventDefault();
    const $form = $(this);
    const $inputField = $form.find('input');

    // error handling
    if (!$inputField.val().trim()) return showAlert('Please enter a username', 'bad');

    // login user
    $.post('/users/login', $form.serialize())
      .then((user) => {
        $inputField.val('');
        renderBasedOnUser(user.name);
        showAlert('Logged in!', 'success');
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


  // = todo events =
  const newTodo = function(event) {
    event.preventDefault();

    // error handling. text field empty
    if (!$(this).find('input').val()) return showAlert('Text field is empty', 'bad');

    // sends todo text backend
    showAlert('Finding suitable category..', 'warning');
    $.post('/todos', $(this).serialize())
      // get new todo object back
      .then((todo) => {
        $(this).find('input').val('');
        showAlert(`Match found!<br><br>Added <span class="special">${todo.description}</span> to<br><span class="special">${todo.name}</span>`, 'success');
        loadTodos();
      });
  };

  const submitEdit = function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    const id = $(this).closest('article').attr("alt");
    $.ajax({ url: "/todos/" + id, data, type: "PUT" })
      .then((res) => {
        loadTodos();
      });
  };

  const completeTodo = function(event) {
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

    $.ajax({ url: '/todos/' + id, type: 'DELETE' })
      .then((res) => {
        loadTodos();
      });
  };
})();
