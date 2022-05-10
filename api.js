const axios = require('axios').default;
const { writeFile } = require('fs');

// = api calls =


const axiosGet = (url, host, params) => {
  const options = {
    params,
    headers: {
      "X-RapidAPI-Host": host,
      "X-RapidAPI-Key": process.env.API_KEY,
    }
  };

  return axios.get(url, options)
  .then((res) => {
    return res.data;
  })
};


const queryFood = (text) => {
  const host = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";
  const url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete";
  const params = { query: text, number: "10" };

  return axios(host, url, params)
    .then((data) => {
      console.log(data);
      const { title } = data.title;
      return ['Food' + title];
    })
};


const queryProducts = (text) => {
  const host = "amazon-price1.p.rapidapi.com";
  const url = "https://amazon-price1.p.rapidapi.com/search";
  const params = { keywords: text, marketplace: "ES" };

  return axios(host, url, params)
    .then((data) => {
      console.log(data);
      const { title } = data.title;
      return ['Product' + title ];
    });
};


const queryMusic = (text) => {
  const url = 'https://shazam.p.rapidapi.com/search';
  const host = 'shazam.p.rapidapi.com';
  const params = { term: text, locale: "en-US", offset: "0", limit: "3" };
  return axiosGet(url, host, params)
    .then((data) => {
      const { title, subtitle } = data.tracks.hits[0];
    return 'Track' + title + 'by:' +  subtitle;
    });
};


const queryBooks = (text) => {

  const url = 'https://hapi-books.p.rapidapi.com/search/' + text.toLowerCase().split(" ").join("+");
  const host = 'hapi-books.p.rapidapi.com';
  const params = {};
  return axiosGet(url, host, params)
    .then((data) => {
      const { title, authors } = data;
      console.log(' Book', title, 'Author', authors);
      return  title +  authors;
    });
};


const queryMovies = (text) => {

  const url = 'https://movie-database-alternative.p.rapidapi.com/';
  const host = 'movie-database-alternative.p.rapidapi.com';
  const params = { s: text, r: "json", page: "1" }
  return axiosGet(url, host, params)
    .then((data) => {
      const { Title, Year } = data.Search;
      console.log(' Movie', Title, 'year', Year);
      return  Title +  Year;
    });
};


  const uclassifyRequest = (subject, text) => {
  const url = `https://api.uclassify.com/v1/uclassify/${subject}/classify`
  const options = `?readkey=${process.env.CLASSIFY_KEY}&text=${text.toLowerCase().split(' ').join('+')}`;
  // topics dictionary
  const topics = {
    Arts: 'art-topics',
    Home: 'home-topics',
    Literature: 'Books',
    Music: 'Music' ,
    Movies_Television: 'Movies',
    Cooking: 'Food',
  };

  return axios.get(url + options)
    .then((res) => {
      const allowedTopics = ['Arts', 'Home', 'Literature', 'Music', 'Movies_Television', 'Cooking'];
      const filtered = Object.entries(res.data).filter((item) => allowedTopics.includes(item[0]));
      const sorted = filtered.sort((a, b) => b[1] - a[1]);
      return topics[sorted[0][0]];
    })
};


// = main function =
const findCategory = (text) => {
  return uclassifyRequest('topics', text)
    .then((topic) => {
      return uclassifyRequest(topic, text)
    })
    .then((category) => {
      return category;
    })
    .catch((err) => {
      console.log('error getting category');
      console.error(err.message);
    });
};

const query = {
  Music(text) {},
  Food(text) {},
  Books(text) {},
  Products(text) {},
  Movies(text) {},
};


const getSubtitle = (category, text) => {
  return query[category.toLowerCase()](text)
  .catch((err) => {
    console.log('error getting subtitle');
    console.error(err.message);
  });
};

module.exports = { findCategory, getSubtitle };

// = TESTING APIs  =
//findCategory("hello");
