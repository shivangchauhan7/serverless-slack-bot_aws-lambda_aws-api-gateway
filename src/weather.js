"use strict";

const { WebClient } = require("@slack/web-api");
const { sendResponse } = require("../functions/index");
const queryString = require("query-string");
const axios = require("axios");

const token = process.env.TOKEN;

const web = new WebClient(token);

module.exports.weather = async event => {
  console.log(event.body);
  let body = {};
  if (typeof event.body !== "object") {
    body = event.body;
  }

  const parameters = queryString.parse(body);
  console.log(parameters);
  const { command, text, channel_id } = parameters;
  if (!command === "/weather" || !text)
    return sendResponse(404, "Wrong command or Invalid text for this handler.");

  try {
    const data = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${process.env.OPENWEATHER_APP_KEY}`
    );
    if (data.data.cod === 200) {
      const weather = data.data.weather[0].main.toLowerCase();
      const temp = data.data.main.temp;
      const tempInCel = (temp - 273.15).toFixed(2);
      let reg = new RegExp(weather);
      console.log("weatherrrr", weather);
      console.log("data", reg);
      let weatherMood = null;
      let emoji = ":world_map:";
      if (reg.test("clouds")) {
        weatherMood = "Cloudy";
        emoji = ":cloud:";
      } else if (reg.test("haze")) {
        weatherMood = "Hazy";
      } else if (reg.test("rain")) {
        weatherMood = "Rainy";
        emoji = ":rain_cloud:";
      } else if (reg.test("clear")) {
        weatherMood = "Clear";
        emoji = ":sunny:";
      } else if (reg.test("mist")) {
        weatherMood = "Misty";
      } else if (reg.test("drizzle")) {
        weatherMood = "Drizzly";
      }
      console.log("weather mood", weatherMood);
      web.chat.postMessage({
        channel: channel_id,
        text: `*PEE PEE POO POO...* Looks like the weather in *${text}* is *${
          weatherMood ? weatherMood : weather
        }* ${emoji} with *${parseInt(tempInCel)}°* temprature :robot_face:`
      });
      return sendResponse(200, "Success");
    } else {
      web.chat.postMessage({
        channel: channel_id,
        text: `*PEE PEE POO POO...* I cannot find weather for *${text}* :robot_face:`
      });
    }
  } catch (e) {
    console.log(e);
    web.chat.postMessage({
      channel: channel_id,
      text: `*PEE PEE POO POO...* I cannot find weather for *${text}* :robot_face:`
    });
  }
};
