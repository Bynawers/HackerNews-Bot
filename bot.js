const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const he = require("he");
const { parseString } = require("xml2js");
const fs = require("fs");

const config = require("./config.json");

let newsPosted = [];

const MAX_NEWS_PER_POST = 3;
const REQUEST_INTERVAL_PER_MINUTES = 60;
const DATA_PATH = "data.json";
const MAX_DATA_SAVED = 50;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  newsPosted = readData();

  const intervalInMilliseconds = REQUEST_INTERVAL_PER_MINUTES * 60 * 1000;
  setInterval(() => {
    fetchHackerNewData();
  }, intervalInMilliseconds);
});

const fetchHackerNewData = () => {
  axios
    .get("https://feeds.feedburner.com/TheHackersNews?max-results=4")
    .then((response) => {
      parseString(response.data, (error, result) => {
        if (error) {
          console.error("Erreur lors de l'analyse du XML:", error);
          return;
        }
        const channel = result.rss.channel[0];
        checkAlreadyPosted(channel.item);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la requête:", error);
    });
};

const checkAlreadyPosted = (request) => {
  const isNewElement = (news) => {
    return !newsPosted.some((elem) => {
      return news.title[0] === elem.title[0];
    });
  };
  postAllNews(request.filter(isNewElement));
};

const postAllNews = (data) => {
  let i = 0;
  console.log(data.length);
  data.forEach((news) => {
    if (i < MAX_NEWS_PER_POST) {
      postNews(news);
      newsPosted.unshift(news);
      if (newsPosted.length > MAX_DATA_SAVED) {
        newsPosted.shift();
      }
      i++;
    }
  });
  saveData(newsPosted);
};

const postNews = (news) => {
  const channelId = config.channel_id;

  const channel = client.channels.cache.get(channelId);

  const description = he.decode(news.description[0]);

  const embed = new EmbedBuilder()
    .setColor(0xb20000)
    .setTitle(news.title[0])
    .setURL(news.link[0])
    .setDescription(description)
    .setTimestamp()
    .setThumbnail(news.enclosure[0].$.url)
    .setFooter({
      text: "The Hacker News",
      iconURL:
        "https://pbs.twimg.com/profile_images/1597647879811657728/FLgHrLHy_400x400.jpg",
    });
  if (channel == undefined) {
    console.log("Channel ID not find");
    return;
  }
  channel.send({ embeds: [embed] });
};

const saveData = (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(DATA_PATH, jsonData);
};

const readData = () => {
  const fileContent = fs.readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(fileContent);
  return data;
};

client.login(config.discord_bot_token);
