const axios = require('axios').default;
const { writeFile } = require('fs');

// = api calls =


const axiosGet = (url, slug, params) => {
  const options = {
    params,
    headers: {
      "X-RapidAPI-Host": url,
      "X-RapidAPI-Key": process.env.API_KEY,
    }
  };

  return axios.get(url + slug, options)
  .then((res) => {
    return res.data;
  })
  .catch((err) => {
    console.error(err.message);
  });
};


const getMusicInfo = (text) => {
  const url = 'https://shazam.p.rapidapi.com/search'
  const slug = '/search'
  const params = { term: text, locale: "en-US", offset: "0", limit: "3" }
  return axiosGet(url, slug, params)
    .then((data) => {
      const { title, subtitle } = data.tracks.hits[0];
      console.log(' track', title, 'by:', subtitle);
    return ['Music', 'Track' + title + 'by:' +  subtitle];
    });
};


const queryBooks = (text) => {
  const options = {
    headers: {
      'X-RapidAPI-Host': 'hapi-books.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.API_KEY,
    },

  };
  const url = "https://hapi-books.p.rapidapi.com/search/" + text.toLowerCase().split(" ").join("+");
  return axios.get(url, options)
    .then((res) => {
    // save results to disc
    writeFile(`./testing/books-${text.split(' ').join('-')}.json`, JSON.stringify(res.data), (err) => {
      if (err) throw err;
      console.log('The books result has been saved!');
    });

    return res.data;
    })
    .catch((err) => {
      console.error(err.message);
    });
};

const queryProducts = (text) => {
  const options = {
    method: "GET",
    url: "https://amazon-price1.p.rapidapi.com/search",
    params: { keywords: text, marketplace: "ES" },
    headers: {
      "X-RapidAPI-Host": "amazon-price1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    },
  };
  return axios.get("https://amazon-price1.p.rapidapi.com/search", options)
    .then((res) => {
    // save results to disc
    writeFile(`./testing/products-${text.split(' ').join('-')}.json`, JSON.stringify(res.data), (err) => {
      if (err) throw err;
      console.log('The products result has been saved!');
    });

    return res.data;
    })
    .catch((err) => {
      console.error(err.message);
    });
};

const queryFood = (text) => {
  const options = {
    method: "GET",
    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete",
    params: { query: text, number: "10" },
    headers: {
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.API_KEY,
    },
  };
  return axios.get( "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete",options)
    .then((res) => {
    // save results to disc
    writeFile(`./testing/food-${text.split(' ').join('-')}.json`, JSON.stringify(res.data), (err) => {
      if (err) throw err;
      console.log('The food result has been saved!');
    });

    return res.data;
    })
    .catch((err) => {
      console.error(err.message);
    });
};

const queryMovies = (text) => {

  const url = 'https://movie-database-alternative.p.rapidapi.com/';
  const host = 'movie-database-alternative.p.rapidapi.com';
  const params = { s: text, plot: 'short', r: "json", page: "1" }
  return axiosGet(url, host, params)
    .then((data) => {
      const { title, subtitle } = data.title;
      console.log(' Movie', title, 'Directed By:', subtitle);
      return 'Title' + title + 'Directed By:' +  subtitle;
    });

};


const uclassifyRequest = (subject, text) => {
  const url = `https://api.uclassify.com/v1/uclassify/${subject}/classify`
  const options = `?readkey=${process.env.CLASSIFY_KEY}&text=${text.toLowerCase().split(' ').join('+')}`;
  return axios.get(url + options)
    .then((res) => {
      const allowedTopics = ['Arts', 'Home', 'Literature', 'Music', 'Movies_Television', 'Cooking'];
      const filtered = Object.entries(res.data).filter((item) => allowedTopics.includes(item[0]));
      const sorted = filtered.sort((a, b) => b[1] - a[1]);
      return sorted[0][0];
    })
    .catch((err) => {
      console.log('error getting topic');
      console.error(err.message);
    });
};

const findTopic = (text) => {
  return uclassifyRequest('topics', text)
    .then((topic) => {
      const subtopic = { Arts: 'art-topics', Home: 'home-topics' }
      return uclassifyRequest(subtopic[topic], text);
    })
};

// = main function =
const findCategory = (text) => {
  return findTopic(text)
};

const getSubtitle = (category, text) => {
  // todo make run external api call
};

module.exports = { findCategory };

// // = TESTING APIs  =
// findCategory("hello");
