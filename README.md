# Discord Bot MTX-SERV

![Project](https://img.shields.io/badge/Personnal-Project-2F77DF?labelColor=679EEE&style=for-the-badge)
![Node](https://img.shields.io/badge/Node%20Js-339933?style=for-the-badge&logo=Node.js&logoColor=ffffff)

Discord bot using the Hacker News API to retrieve news and post them to a channel.

### HackerNews credential

- OAuth: https://mtxserv.com/fr/mon-compte/oauth
- Api Key: https://mtxserv.com/fr/mon-compte/api

### Create Bot

You need to create credential on Discord: https://discordapp.com/developers/applications/

### Install

Dependencies

```
npm install
```

To use this bot, you need to create and replace none values in your configuration `config.json` :

```
{
    "discord_bot_token": <TOKEN>,
    "channel_id": <ID>
}
```

Start the bot from the terminal :

```
node bot.js
```
