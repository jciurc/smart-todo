// == events ==
// delete tweet
$('.delete-button').on('click', (event) => {
  event.preventDefault();
  const $todo = $(this).closest('article');
  const id = $todo.id;

  $.delete('/' + id)
    .then(() => {
      $todo.closest('section').removeElement($todo)
    })
});

const safeHtml = (string) => {

}


const buildTodoCard = (todo) => {
  const htmlString =  `
    <div> ${safeHtml(todo.description)} </div>
    <div> ${todo.category} </div>
    `
    return htmlString;
}

renderTodos = (todos) => {
  buildTodoCard(todos[0])
}

router.get('/properties', (req, res) => {
  db.getAllTodos(req.cookies.user)
  .then(renderTodos)
  .catch(e => {
    console.error(e);
    res.send(e)
  });
});

module.exports = { renderTodos };