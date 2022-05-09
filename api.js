const axios = require('axios').default;
const any = require('promise.any');

// = api calls =
const queryFood = (text) => {
  const options = {
    method: "GET",
    url: "https://themealdb.p.rapidapi.com/filter.php",
    params: { c: text },
    headers: {
      "X-RapidAPI-Host": "themealdb.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    },
  };
  return axios
    .get("https://themealdb.p.rapidapi.com/filter.php", options)
    .then((res) => {
      console.log("food query response", res);
      if (res.length > 0) return "Food";
    })
    .catch((err) => {
      console.error("err", err.message);
    });
};

const queryMusic = (text) => {
  const options = {
    params: { term: text, locale: "en-US", offset: "0", limit: "3" },
    headers: {
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    }
  };

  return axios.get('https://shazam.p.rapidapi.com/search', options)
  .then((res) => {
    console.log('music query hits', Object.keys(res.data));
    if (Object.keys(res.data).length > 0) return "Music";
  })
  .catch((err) => {
    console.error(err.message);
  });
};

const queryMovies = (text) => {
  const options = {
    params: { s: text, r: "json", page: "1" },
    headers: {
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    },
  };
  return axios.get('https://movie-database-alternative.p.rapidapi.com/', options)
    .then((res) => {
      console.log('movies query hits:', res.data.Search.length);
      if (res.data.search.length > 1) return "Movies";
    })
    .catch((err) => {
      console.error(err.message);
    });
};


// = main function =
const findCategory = (text) => {
  return any([
    queryFood(text),
    queryMusic(text),
  ])
    .then((category) => {
      console.log('promise any response', category);
      return category || queryMovies(text).then(category => category || 'Unlabeled')
      //return category.then((category) => category || "Unlabeled");
    })
    .catch((err) => {
      console.log('error finding category', err.message || '');
      console.error(err.message);
      return 'Unlabeled';
    });
};

module.exports = { findCategory };
