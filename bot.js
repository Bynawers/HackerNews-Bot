const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const { parseString } = require("xml2js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

/*
const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
  ],
  partials: ["CHANNEL"],
});*/

const config = require("./config.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //news();
  fetchHackerNewData();
});

const fetchHackerNewData = () => {
  axios
    .get("https://feeds.feedburner.com/TheHackersNews")
    .then((response) => {
      parseString(response.data, (error, result) => {
        if (error) {
          console.error("Erreur lors de l'analyse du XML:", error);
          return;
        }
        const channel = result.rss.channel[0];
        console.log(channel.item);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la requête:", error);
    });
};

const news = () => {
  const channelId = config.channel_id;

  const channel = client.channels.cache.get(channelId);

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Hacking News !")
    .setDescription("Some description here")
    .setTimestamp()
    .setFooter({
      text: "Some footer text here",
      iconURL: "https://i.imgur.com/AfFp7pu.png",
    });
  if (channel == undefined) {
    console.log("Channel ID not find");
    return;
  }
  channel.send({ embeds: [embed] });
};

client.login(config.discord_bot_token);
