$(document).ready(() => {

  $('#new-todo').on('apis', callApis);
});

const fetchMoviesForUser = function () {
  const options = {
    method: "GET",
    url: "https://movie-database-alternative.p.rapidapi.com/",
    params: { s: "Avengers Endgame", r: "json", page: "1" },
    headers: {
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      "X-RapidAPI-Key": "env",
    },
  };
  return $.ajax(options)
    .then((response) => {
      if (response.data.search.title.length >= 1) return "Movies";

    })
    .catch ((err) => {
      console.log("err", err)
  })
};

const fetchMusicForUser = (text) => {
  const options = {
    method: 'get',
    url: 'https://shazam.p.rapidapi.com/search',
    data: { term: text, locale: "en-US", offset: "0", limit: "5" },
    headers: {
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      "X-RapidAPI-Key": "env",
    }
  };

  return $.ajax(options)
    .then((res) => {
      console.log('music response', res);
      if (res.tracks.hits.length > 1) return "Music";
    })
    .catch((err) => {
      console.error(err);
    });
};

const findCategory = (text) => {
  return Promise.any([
    fetchMusicForUser(text),
    // fetchMoviesForUser(text),
  ])
  .then((category) => {
    return category || 'Unlabeled';
  })
  .catch((err) => {
    console.error(err);
  });
};

const callApis = function() {
  console.log("this apis", $(this));
  const $form = $(this).closest('form');
  const $inputField = $form.find('input');
  const description = $inputField.val() || "Avengers Endgame";
  $inputField.val('');

  findCategory(description)
    .then((category) => {
      console.log(category || 'Unlabeled');
      const user_id = 1; // need to get user id
    $.post('/todos', {user_id, description, category})
    $.get('/todos');
  })
  .catch((err) => {
    console.log('something went wrong', err?.message || err);
  });
};