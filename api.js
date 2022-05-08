const axios = require('axios').default;

// = api calls =
const fetchMoviesForUser = (text) => {
  const options = {
    url: "https://movie-database-alternative.p.rapidapi.com/",
    params: { s: text, r: "json", page: "1" },
    headers: {
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    },
  };
  return $.ajax(options)
    .then((response) => {
      if (response.data.search.title.length >= 1) return "Movies";

    })
    .catch((err) => {
      console.log("err", err);
    });
};

const fetchMusicForUser = (text) => {
  const options = {
    params: { term: text, locale: "en-US", offset: "0", limit: "3" },
    headers: {
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    }
  };

  return axios.get('https://shazam.p.rapidapi.com/search', options)
    .then((res) => {
      if (Object.keys(res.data).length > 0) return "Music";
    })
    .catch((err) => {
      console.error(err);
    });
};

// = main function =
const findCategory = (text) => {
  const apiList = [fetchMusicForUser, fetchMoviesForUser];
  // todo sanitize query text
  Promise.any(apiList)
  return fetchMusicForUser(text)
    .then((category) => {
      return category || 'Unlabeled';
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { findCategory }