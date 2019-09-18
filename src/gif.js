"use strict";

const { WebClient } = require("@slack/web-api");
const { sendResponse } = require("../functions/index");
const queryString = require("query-string");
const fs = require("fs");
const axios = require("axios");

const token = process.env.TOKEN;

const web = new WebClient(token);

module.exports.gif = async event => {
  console.log(event.body);
  let body = {};
  if (typeof event.body !== "object") {
    body = event.body;
  }

  const parameters = queryString.parse(body);
  const { command, channel_id, text } = parameters;
  if (!command === "/joke" || !text)
    return sendResponse(404, "Wrong command or Invalid text for this handler.");
  let imageFile = null;
  if (text === "success") {
    imageFile = "success";
  } else if (text === "happy") {
    imageFile = "happy";
  } else if (text === "sarcastic") {
    imageFile = "sarcastic";
  } else if (text === "angry") {
    imageFile = "angry";
  } else if (text === "sad") {
    imageFile = "sad";
  }

  const file = fs.createReadStream(
    `public/${imageFile}/${Math.floor(Math.random() * 5) + 1}.gif`
  );
  try {
    web.files.upload({
      channels: channel_id,
      file,
      title: text
    });
    return sendResponse(200, "Success");
  } catch (e) {
    console.log(e);
    web.chat.postMessage({
      channel: channel_id,
      text: `*PEE PEE POO POO...* I cannot find any GIF for *${text}* :robot_face:`
    });
  }
};
