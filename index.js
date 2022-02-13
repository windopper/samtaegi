const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const { joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const basic_commands = require('./src/commands/basic_commands')
const music_player_commands = require('./src/commands/music_player_commands')
const webshot = require('node-webshot')
const play = require('play-dl')
const resolve = require('path').resolve
const file = require('./src/designs/musicQueue');
const { deploy_commands } = require('./deploy-commands')
const { menuSelect } = require('./src/functions/musicMenuSelect')


client.on('ready', () => {
    console.log('Ready!');
    console.log(process.env.BOT_TOKEN)
    // deploy_commands()
});

client.on('interactionCreate', async interaction => {

    
    if(interaction.isSelectMenu()) {
        menuSelect(interaction)
        
    }
    else if(!interaction.isCommand()) return;

    
    try {
        music_player_commands.listener(interaction)
    }
    catch(err) {
        interaction.reply({
            content: '오류가 발생하였습니다'
        })
    }
})


client.on('messageCreate', (message) => {

    if(message.author.bot) return
    
    basic_commands.listener(message)
    music_player_commands.listener(message)

//     if(message.content === 'url') {
//         let url = resolve('./src/designs/musicQueue.html')
//         console.log(url)
//         webshot('./src/designs/musicQueue.html', 'google.png', {siteType: "file"}, () => {
//         message.channel.send({files: [{
//             attachment: './google.png',
//             name: 'google.png'
//     }]})
// })
//     }

    // webshot('file:///C:/Users/kwon_notebook/workspace/samtaegi-discord/src/designs/musicQueues.html', 'google.png', () => {
    //     message.channel.send({files: [{
    //         attachment: './google.png',
    //         name: 'google.png'
    //     }]})
    // })



})



client.login(process.env.BOT_TOKEN)

// const config = require('./config.json');
// client.login(config.BOT_TOKEN)

// if(process.env.BOT_TOKEN == undefined) client.login(config.BOT_TOKEN)
// else client.login(process.env.BOT_TOKEN)
