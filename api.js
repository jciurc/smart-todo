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
    const url =
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete";
    const host = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";
    const params = { query: text, number: "10" };

    return this.axiosGet(url, host, params).then((data) => {
      console.log("food response", data[0]);
      const { title } = data[0].title;
      return "Recipe: " + title;
    });
  },

  Products(text) {
    const url = "https://amazon-price1.p.rapidapi.com/search";
    const host = "amazon-price1.p.rapidapi.com";
    const params = { keywords: text, marketplace: "ES" };

    return this.axiosGet(url, host, params).then((data) => {
      console.log("products response", data[0]);
      const { title } = data[0].title;
      return "Product: " + title;
    });
  },

  Music(text) {
    const url = "https://shazam.p.rapidapi.com/search";
    const host = "shazam.p.rapidapi.com";
    const params = { term: text, locale: "en-US", limit: "5" };

    return this.axiosGet(url, host, params).then((data) => {
      if (!data.tracks.hits[0]) return "No track information.";
      const { title, subtitle } = data.tracks.hits[0].track;
      console.log("Track " + title + " by: " + subtitle);
      return "Track " + title + " by: " + subtitle;
    });
  },

  Books(text) {
    const url =
      "https://hapi-books.p.rapidapi.com/search/" +
      text.toLowerCase().split(" ").join("+");
    const host = "hapi-books.p.rapidapi.com";
    const params = {};

    return this.axiosGet(url, host, params).then((data) => {
      const { title, authors } = data;
      console.log(" Book", title, "Author", authors);
      return title + authors;
    });
  },

  Movies(text) {
    const url = "https://movie-database-alternative.p.rapidapi.com/";
    const host = "movie-database-alternative.p.rapidapi.com";
    const params = { s: text, r: "json", page: "1" };
    return this.axiosGet(url, host, params).then((data) => {
      const { Title, Year } = data.Search;
      console.log(" Movie", Title, "year", Year);
      return `${Title} (${Year})`;
    });
  },
};

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
  console.log("subtitle category", category);
  console.log("sub title text", text);
  return query[category](text);
};

// = main function =
const findCategory = (text) => {
  return uclassifyRequest("topics", text)
    .then((topic) => {
      return uclassifyRequest(topic, text);
    })
    .then((category) => {
      return category;
    });
};

module.exports = { findCategory, getSubtitle };

// = TESTING APIs  =
findCategory("adele") //description
  .then(getCategoryByName)
  .then((cat) => {
    getSubtitle(cat.name, "adele")
      .then((subtitle) => {
        console.log("cat name", cat.name);
        console.log("subtitle", subtitle);
      })
  });



