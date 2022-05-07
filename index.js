const PORT = 8080;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
//webscraper


app.listen(PORT, console.log('server is running!'));

client.once('ready', () => {
    console.log('ready!');
});

const bookData = [];
client.on('messageCreate', (message) => {
    if (message.content === 'hello' && !message.author.bot) {        
        const URL = 'https://bookwalker.jp/category/3/?qspp=1&np=1';


        axios(URL).then((respons) => {
            const htmlParser = respons.data;

            const $ = cheerio.load(htmlParser);

            $(".m-book-item ", htmlParser).each(function() {
                const title = $(this).find(".m-book-item__title").find("a").attr("title");
                const price = $(this).find(".m-book-item__price-num").text();
                bookData.push({title, price, inline: true});
            });
        }).then(() => {
            message.channel.send('**BOOKWALKERの期間限定価格商品↓↓↓**');
            bookData.forEach((data) => {

                message.channel.send(`『${data.title}』   |   ${data.price}円`);
            });

        });
    }
});



client.login('yourToken');
