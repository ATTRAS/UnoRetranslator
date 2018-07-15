const Telegraf = require('telegraf');
const config = require('../config.json');
const arduino = require('./transfer');

const bot = new Telegraf(config.token);

arduino.initArduino();

bot.on('text', (ctx) => {
    const date = new Date(ctx.message.date * 1000);
    arduino.sendMessage({
        sendTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`, 
        author: ctx.message.from.first_name, 
        rawContent: ctx.message.text
    });
});

bot.startPolling();