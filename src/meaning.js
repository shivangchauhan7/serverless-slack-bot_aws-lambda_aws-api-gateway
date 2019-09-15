"use strict";

const { WebClient } = require("@slack/web-api");
const { sendResponse } = require("../functions/index");
const queryString = require("query-string");
const { oxfordInstance } = require("../config/axios");

const token = process.env.TOKEN;

const web = new WebClient(token);

module.exports.meaning = async (event, context) => {
  console.log(event.body);
  let body = {};
  if (typeof event.body !== "object") {
    body = event.body;
  }

  const parameters = queryString.parse(body);
  console.log(parameters);
  const { command, text, channel_id } = parameters;
  if (!command === "/meaning" || !text)
    return sendResponse(404, "Wrong command or Invalid text for this handler.");

  try {
    const data = await oxfordInstance.get(`/${text}`);
    const definition =
      data.data.results[0].lexicalEntries[0].entries[0].senses[0]
        .definitions[0];
    web.chat.postMessage({
      channel: channel_id,
      text: `*PEE PEE POO POO...* I found this meaning of *"${text}"* --- *"${definition}"* :robot_face:`
    });
    return sendResponse(200, "Success");
  } catch (e) {
    web.chat.postMessage({
      channel: channel_id,
      text: `*PEE PEE POO POO...* I cannot find any meaning of *"${text}"* :robot_face:`
    });
  }

  //   const body = JSON.parse(event.body);
  //   console.log(body);
  //   context.done(null, {
  //     statusCode: 200,
  //     body: body.challenge,
  //     headers: { "Access-Control-Allow-Origin": "*" }
  //   });
};
