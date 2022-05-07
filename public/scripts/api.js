const axios = require("axios");


const fetchMusicForUser = function () {
  const musicOptions = {
    method: "GET",
    url: "https://shazam.p.rapidapi.com/search",
    params: { term: "kiss the rain", locale: "en-US", offset: "0", limit: "5" },
    headers: {
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      "X-RapidAPI-Key": "***REMOVED***",
    },
  };
  axios.request(musicOptions)
    .then((response) => {
      console.log("data", response.data);

    })
    .catch ((err) => {
      console.log("err", err)
  })
};
fetchMusicForUser()

const fetchMoviesForUser = function () {
  const movieOptions = {
    method: "GET",
    url: "https://movie-database-alternative.p.rapidapi.com/",
    params: { s: "Avengers Endgame", r: "json", page: "1" },
    headers: {
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      "X-RapidAPI-Key": "***REMOVED***",
    },
  };
  axios.request(movieOptions)
    .then((response) => {
      console.log("data", response.data);

    })
    .catch ((err) => {
      console.log("err", err)
  })
};
fetchMoviesForUser()

