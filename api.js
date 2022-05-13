const axios = require("axios").default;

// = External API Calls =
// Object that holds all our API methods so we can call them dynamically
const query = {
  axiosGet(url, host, params) {
    const options = {
      params,
      headers: {
        "X-RapidAPI-Host": host,
        "X-RapidAPI-Key": process.env.API_KEY,
      },
    };

    return axios.get(url, options).then((res) => {
      return res.data;
    });
  },

  Unlabeled() {
    return Promise.resolve('😵‍💫');
  },

  Food(text) {
    const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete';
    const host = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';
    const params = { query: text, number: '10' };

    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Got food response');
        const { name } = data[0] || { name: text };
        return `Enjoy the: ${name.slice(0, 80)} 😊🍦`;
      });
  },


  Products(text) {
    const url = 'https://amazon-price1.p.rapidapi.com/search';
    const host = 'amazon-price1.p.rapidapi.com';
    const params = { keywords: text, marketplace: 'ES' };

    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Got Amazon response');

        const { name } = data[0] || { name: 'No product info' };
        return 'Buy: ' + name.slice(0, 80);
      });
  },

  Music(text) {
    const url = "https://shazam.p.rapidapi.com/search";
    const host = "shazam.p.rapidapi.com";
    const params = { term: text, locale: "en-US", limit: "5" };

    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Got Shazam response');
        if (!data.tracks) return `Listen to: ${text.slice(0, 40)} by unknown`;
        const { title, subtitle } = data.tracks.hits[0].track;
        return `Listen to: ${title.slice(0, 50)} by ${subtitle.slice(0, 30)}`;
      });
  },

  Books(text) {
    const url =
      "https://hapi-books.p.rapidapi.com/search/" +
      text.toLowerCase().split(" ").join("+");
    const host = "hapi-books.p.rapidapi.com";
    const params = {};

    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Got book response');
        if (!data[0]) return `Read: ${text.slice(0, 40)} by unknown`;
        const { name = text, authors = ['unknown'] } = data[0];
        return `Read: ${name.slice(0, 50)} by ${authors.join().slice(0, 30)}`;
      });
  },

  Movies(text) {
    const url = "https://movie-database-alternative.p.rapidapi.com/";
    const host = "movie-database-alternative.p.rapidapi.com";
    const params = { s: text, r: "json", page: "1" };
    return this.axiosGet(url, host, params)
      .then((data) => {
        if (data.Error) return `Watch: ${text} (unknown year)`;
        const { name = text, Year = 'unknown year' } = data.Search[0];
        return `Watch: ${name.slice(0, 80)} (${Year})`;
      });
  },

  // rawg.io api
  Games(text) {
    const options = {
      method: 'GET',
      url: `https://api.rawg.io/api/games?key=${process.env.RAWG_KEY}`,
      params: { search: text }
    };
    return axios.request(options)
      .then((res) => {
        console.log('Got game response', res.data);
        if (!res.data.results[0]) return `Play: ${text.slice(0, 80)}, what a classic! 🎮`;
        const name = res.data.results[0].name;
        const genre = res.data.results[0].genres[0].name;
        return `Play: ${name} (${genre})`;
      });
  },
};


// Find category
const queryUclassify = (text) => {
  const url = `https://api.uclassify.com/v1/uclassify/topics/classify?readkey=${process.env.CLASSIFY_KEY}`;
  const options = `&text=${text.toLowerCase().split(" ").join("+")}`;

  // topics dictionary
  const broadTopics = {
    Arts: 'art-topics',
    Home: 'home-topics',
    Sports: 'sport-topics',
    Games: 'Games',
    Computers: 'Products',
    Business: 'Products',
  };
  const subTopics = {
    Literature: 'Books',
    Music: 'Music',
    Movies_Television: 'Movies',
    Cooking: 'Food',
    Family: 'Products',
    Motorsports: 'Games',
    Cycling: 'Products',
  };
  const allowedTopics = Object.keys(broadTopics).concat(Object.keys(subTopics));

  // first query for broader topic
  return axios.get(url + options)
    .then((res) => {
      const filtered = Object.entries(res.data).filter((item) => allowedTopics.includes(item[0]));
      const best = filtered.sort((a, b) => b[1] - a[1]);
      if (filtered[0][1] == filtered[1][1] || best[0][1] < 0.03) return 'Unlabeled'; // poor match
      return broadTopics[best[0][0]] || 'Unlabeled';
    })
    .then((topic) => {
      // These categories don't need a second query
      if (['Games', 'Unlabeled', 'Products'].includes(topic)) return topic;

      // Query again for sub topic
      const url = `https://api.uclassify.com/v1/uclassify/${topic}/classify?readkey=${process.env.CLASSIFY_KEY}`;
      return axios.get(url + options)
        .then((res) => {
          const filtered = Object.entries(res.data).filter((item) => allowedTopics.includes(item[0]));
          const best = filtered.sort((a, b) => b[1] - a[1]);
          return subTopics[best[0][0]];
        });
    });
};


// = main functions =
const findCategory = (text) => {
  return queryUclassify(text)
    .catch((err) => {
      console.log('error finding category', err.message);
      return 'Unlabeled';
    });
};

const getDescription = (category = 'Unlabeled', text = null) => {
  if (typeof query[category] === 'undefined') return 'no details';
  // Convert first character to upper case
  const title = text.slice(0, 1).toUpperCase() + text.slice(1);
  return query[category](title)
    .catch((err) => {
      console.log('error getting description for ', category, text, err.message);
      return `no details`;
    });
};

module.exports = { findCategory, getDescription };
