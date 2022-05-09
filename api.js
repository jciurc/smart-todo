const axios = require('axios').default;

// = api calls =
const fetchMoviesForUser = (text) => {
  const options = {
    params: { s: text, r: "json", page: "1" },
    headers: {
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    },
  };
  return axios.get('https://movie-database-alternative.p.rapidapi.com/', options)
    .then((res) => {
      if (res.data.length > 1) return "Movies";
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
  // todo sanitize query text
  return Promise.any([
    fetchMusicForUser(text),
    fetchMoviesForUser(text),
  ])
    .then((category) => {
      console.log('promise any response', category);
      return category || 'Unlabeled';
    })
    .catch((err) => {
      console.error(err);
      return 'Unlabeled';
    });
};

module.exports = { findCategory }