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
        const { title } = data[0] || { title: text };
        return `Enjoy the ${title.slice(0, 50)} 😊🍦`;
      });
  },


  Products(text) {
    const url = 'https://amazon-price1.p.rapidapi.com/search';
    const host = 'amazon-price1.p.rapidapi.com';
    const params = { keywords: text, marketplace: 'ES' };

    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Got Amazon response');

        const { title } = data[0] || { title: 'No product info' };
        return title.slice(0, 50);
      });
  },

  Music(text) {
    const url = "https://shazam.p.rapidapi.com/search";
    const host = "shazam.p.rapidapi.com";
    const params = { term: text, locale: "en-US", limit: "5" };

    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Got Shazam response');
        if (!data.tracks) return `Track ${text.slice(0, 40)} by: unknown`;
        const { title, subtitle } = data.tracks.hits[0].track;
        return `Track ${title.slice(0, 40)} by: ${subtitle.slice(0, 20)}`;
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
        if (!data[0]) return `${text.slice(0, 40)} by: unknown`;
        const { name = text, authors = ['unknown'] } = data[0];
        return `${name.slice(0, 40)} by: ${authors.join().slice(0, 20)}`;
      });
  },

  Movies(text) {
    const url = "https://movie-database-alternative.p.rapidapi.com/";
    const host = "movie-database-alternative.p.rapidapi.com";
    const params = { s: text, r: "json", page: "1" };
    return this.axiosGet(url, host, params)
      .then((data) => {
        if (data.Error) return `${text} (unknown year)`;
        const { Title = text, Year = 'unknown year' } = data.Search[0];
        return `${Title.slice(0, 50)} (${Year})`;
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
        if (!res.data.results[0]) return '';
        const name = res.data.results[0].name;
        const genre = res.data.results[0].genres[0].name;
        console.log(`name: ${name} genre: ${genre}`);
        return `${name} (${genre})`;
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
    Sports: 'home-topics',
    Games: 'Games',
  };
  const subTopics = {
    Literature: 'Books',
    Music: 'Music',
    Movies_Television: 'Movies',
    Cooking: 'Food',
    Family: 'Products',
  };
  const allowedTopics = Object.keys(broadTopics).concat(Object.keys(subTopics));

  // first query for broader topic
  return axios.get(url + options)
    .then((res) => {
      const filtered = Object.entries(res.data).filter((item) => allowedTopics.includes(item[0]));
      const best = filtered.sort((a, b) => b[1] - a[1]);
      if (best[0][1] < 0.01) return 'Unlabeled'; // poor match
      return broadTopics[best[0][0]] || 'Unlabeled';
    })
    .then((topic) => {
      // These categories don't need a second query
      if (['Games', 'Unlabeled'].includes(topic)) return topic;

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

const getSubtitle = (category = 'Unlabeled', text = null) => {
  if (typeof query[category] === 'undefined') return 'no details';
  return query[category](text)
    .catch((err) => {
      console.log('error getting subtitle for ', category, text, err.message);
      return `no details`;
    });
};

module.exports = { findCategory, getSubtitle };


