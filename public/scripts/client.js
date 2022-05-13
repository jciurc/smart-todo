(() => {
  $(document).ready(() => {
    // user routes
    $('nav #login').on('submit', loginSubmit);
    $('nav #logout button').on('click', loggedOut);

    // todo routes
    $('#new-todo').on('submit', newTodo);
    $('.todo-container').on('click', 'li.todo i.fa-edit', editMode);
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
    }, 100);
  });

  // == helpers ==
  const getGreeting = (hours) => {
    if (hours < 3) return 'Get some rest';
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good work today';
  };

  const showAlert = (message, style) => {
    const $alert = $('#alert-box');
    $alert.removeClass('success warning danger').addClass(style);
    $alert.find('.alert-text').text('').append(message);
    $alert.slideDown();
    setTimeout(() => {
      $alert.slideUp();
    }, 6000);
  };

  const shakeElement = ($ele) => {
    $ele.addClass('shake_anim');
    setTimeout(() => {
      $ele.removeClass('shake_anim');
    }, 3000);
  };

  const editMode = function() {
    $('.editing').removeClass('editing ring');
    const $todo = $(this).closest('li.todo').addClass('editing ring');
    const $textarea = $todo.find('form').find('[name="description"]').focus();
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
<li class="todo rounded flex-col flex-nowrap justify-center my-2 ring-blue-300" completed="${todo.completed}" alt="${todo.id}">
  <article class="card flex justify-center items-center ${todo.completed ? 'complete' : ''} rounded bg-slate-700 m-3 p-2">
    <i type="button" ${todo.completed ? 'checked' : ''} class="check-complete hover cursor-pointer fa-${todo.completed ? 'solid' : 'regular'} fa-circle-check " id="flexCheckDefault" ></i>
    <div>
      <p class="description text-base text-center self-center p-2">${safeHtml(todo.description)}</p>
      <p class="subtitle text-base text-center">${safeHtml(todo.subtitle)}</p>
    </div>
    <i class="far fa-edit hover cursor-pointer"></i>
  </article>

  <form class="edit">
    <header class="m-2">
      <label for="text" class="text-center"">Update Todo</label><i class="fa-solid fa-xmark cursor-pointer m-1"></i>
    </header>
    <textarea name="description" class="text-base text-center self-center rounded-xl bg-slate-800 my-2 mx-auto p-2" maxlength="80">${safeHtml(todo.description.slice(0, 80))}</textarea>
    <select name="category_id" class="text-base rounded-full bg-slate-900 m-30">
      ${sorted.join('\n')}
    </select>
      <textarea name="subtitle" class="text-base text-center self-center rounded-full bg-slate-800 my-2 mx-auto p-2" maxlength="80">${safeHtml(todo.subtitle.slice(0, 80))}</textarea>
    <footer class="flex justify-around pb-4">
      <button type="submit" class="confirm-edit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirm</button>
      <button type="button" class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
    </footer>
  </form>
</li>
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
    const $newTodoForm = $('#new-todo');
    if (name) {
      $('#login').hide();
      $('#logout').show().find('div').append(`<p class="align-text">${safeHtml(name)}</p>`);
      $('#splash').hide();
      $newTodoForm.show();
      $newTodoForm.find('h1').text(`${getGreeting(currentHours)}, ${safeHtml(name)}!`);
      $newTodoForm.find('input').focus()
      return;
    }
    $('#login').show();
    $('#splash').show();
    $('#logout').hide().find('div').text('');
    $newTodoForm.hide().find('h1').text('');
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
    if (!$inputField.val().trim()) return showAlert('Please enter a username', 'danger');

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

    // error handling
    if (!$(this).find('input').val()) return showAlert('Text field is empty', 'danger');

    // sends todo text backend
    showAlert('Finding suitable category . .', 'warning');
    $.post('/todos', $(this).serialize())
      // get new todo object back
      .then((todo) => {
        $(this).find('input').val('');
        showAlert(`Match found!<br><br>Added <span class="special">${todo.description}</span> to<br><span class="special">${todo.name}</span>`, 'success');
        shakeElement($('#categories-container').find(`article#${todo.name}`));
        loadTodos();
      });
    };


  const submitEdit = function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    const id = $(this).closest('li.todo').attr("alt");
    $.ajax({ url: "/todos/" + id, data, type: "PUT" })
      .then((todo) => {
        console.log('updated todo', todo);
        showAlert('Todo updated!', 'success');
        loadTodos();
      });
  };

  const completeTodo = function(event) {
    event.stopPropagation();
    event.preventDefault();
    const $todo = $(this).closest('li.todo');
    const data = 'complete=' + !($todo.attr('completed') === 'true');
    const id = $todo.attr('alt');
    $.ajax({ url: "/todos/" + id, data, type: "PATCH" })
      .then((todo) => {
        loadTodos();
      });
  };

  const deleteTodo = function() {
    const $todo = $(this).closest('li.todo');
    const id = $todo.attr('alt');

    $.ajax({ url: '/todos/' + id, type: 'DELETE' })
      .then((res) => {
        showAlert('Todo deleted!', 'warning');
        loadTodos();
      });
  };
})();
