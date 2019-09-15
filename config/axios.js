const axios = require("axios");

const oxfordInstance = axios.create({
  baseURL: "https://od-api.oxforddictionaries.com/api/v2/entries/en-us",
  headers: {
    app_id: process.env.OXFORD_APP_ID,
    app_key: process.env.OXFORD_APP_KEY
  }
});

module.exports = {
  oxfordInstance
};
