const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const { joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const config = require('./config.json');
const basic_commands = require('./src/commands/basic_commands')
const music_player_commands = require('./src/commands/music_player_commands')
const webshot = require('node-webshot')
const play = require('play-dl')
const resolve = require('path').resolve
const file = require('./src/designs/musicQueue');
const { userMention } = require('@discordjs/builders');



client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', (message) => {

    if(message.author.bot) return
    
    basic_commands.listener(message)
    music_player_commands.listener(message, client)

    message.channel.send('@'+message.author.id+'')
    

    if(message.content === 'url') {
        url = resolve('./src/designs/musicQueue.html')
        console.log(url)
        webshot('./src/designs/musicQueue.html', 'google.png', {siteType: "file"}, () => {
        message.channel.send({files: [{
            attachment: './google.png',
            name: 'google.png'
    }]})
})
    }

    // webshot('file:///C:/Users/kwon_notebook/workspace/samtaegi-discord/src/designs/musicQueues.html', 'google.png', () => {
    //     message.channel.send({files: [{
    //         attachment: './google.png',
    //         name: 'google.png'
    //     }]})
    // })



})

client.login(config.BOT_TOKEN)