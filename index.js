const Discord = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const config = require('./config.json');
const ytdl = require('ytdl-core');
const youtube_player = require('./src/functions/music_player')



let connection

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', (message) => {
    if(message.content === 'ping') {
        message.channel.send('pong');
    }
    if(message.content === '!connect' && message.member.voice.channel) {
        connection = joinVoiceChannel({
            channelId: message.member.voice.channelId,
            guildId: message.guildId,
            adapterCreator: message.guild.voiceAdapterCreator,
        })
        youtube_player.play('https://www.youtube.com/watch?v=FKzhORmAbLs', connection)
        
    }
    if(message.content === '!disconnect' && getVoiceConnection(message.guildId) !== undefined) {
        connection.destroy();
    }
})

client.login(config.BOT_TOKEN)