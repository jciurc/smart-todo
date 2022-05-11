const axios = require("axios").default;
const { getCategoryByName } = require("./queries");

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

  Food(text) {
    const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete';
    const host = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';
    const params = { query: text, number: '10' };

    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Got food response');
        const { title } = data[0] || { title: text };
        return `Enjoy the ${title.slice(0, 50)} 😊🍦`;
      })
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
      })
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
      })
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
        const { name = text, authors = 'unknown' } = data[0] || { name: text, authors: ['unknown'] };
        return `${name.slice(0, 40)} by: ${authors.join().slice(0, 20)}`;
      });
  },

  Movies(text) {
    const url = "https://movie-database-alternative.p.rapidapi.com/";
    const host = "movie-database-alternative.p.rapidapi.com";
    const params = { s: text, r: "json", page: "1" };
    return this.axiosGet(url, host, params)
      .then((data) => {
        console.log('Found movie response');
        if (data.Error) return `${text} (unknown year)`
        const { Title, Year } = data.Search[0] || { Title: text, Year: 'unknown year' };
        return `${Title.slice(0, 50)} (${Year})`;
      });
  },
};

// Find category
const uclassifyRequest = (subject, text) => {
  const url = `https://api.uclassify.com/v1/uclassify/${subject}/classify`;
  const options = `?readkey=${process.env.CLASSIFY_KEY}&text=${text
    .toLowerCase()
    .split(" ")
    .join("+")}`;
  // topics dictionary
  const topics = {
    Arts: "art-topics",
    Home: "home-topics",
    Sports: "home-topics",
    Literature: "Books",
    Music: "Music",
    Movies_Television: "Movies",
    Cooking: "Food",
    Family: "Products",
  };

  return axios.get(url + options).then((res) => {
    const allowedTopics = [
      "Arts",
      "Home",
      "Literature",
      "Music",
      "Movies_Television",
      "Cooking",
      "Family",
    ];
    const filtered = Object.entries(res.data).filter((item) =>
      allowedTopics.includes(item[0])
    );
    const sorted = filtered.sort((a, b) => b[1] - a[1]);
    return topics[sorted[0][0]];
  });
};

const getSubtitle = (category, text) => {
  return query[category](text)
    .catch((err) => {
      console.log('error getting subtitle', err.message);
      return `no details`;
    });
};

// = main function =
const findCategory = (text) => {
  return uclassifyRequest("topics", text)
    .then((topic) => {
      return uclassifyRequest(topic, text);
    })
    .then((category) => {
      return category;
    })
    .catch((err) => {
      console.log('error finding category', err.message);
      return 'Unlabeled';
    });
};

module.exports = { findCategory, getSubtitle };

// = TESTING APIs  =
findCategory("hello") //description
  .then(getCategoryByName)
  .then((cat) => {
    console.log("cat ", cat);
     getSubtitle(cat.name, "hello")
      .then((subtitle) => {
        console.log("cat name", cat.name);
        console.log("subtitle", subtitle);
      })
  });



// = Testing API =
// query.Products('cheshel')
// // findCategory('chess').then(getSubtitle)
//   .then((response) => {
//     console.log('found:', response);
//   });

const options = {
  method: 'GET',
  url: 'https://rawg-video-games-database.p.rapidapi.com/games',
  headers: {
    'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com',
    'X-RapidAPI-Key': '9d724666d4msha087a518290223bp1e9994jsn841dcf3e5cdb'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});

