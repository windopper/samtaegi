const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const config = require('./config.json');
const basic_commands = require('./src/commands/basic_commands')
const music_player_commands = require('./src/commands/music_player_commands')
const webshot = require('node-webshot')

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', (message) => {
    // const embed = new MessageEmbed()
    //     .setImage('./hello_world.png');


    if(message.author.bot) return

    // webshot('google.com', 'google.png', function(err) {
    //     message.channel.send({ files: [{ attachment: "google.png"}] })
    //   });
    
    basic_commands.listener(message)
    music_player_commands.listener(message, client)
    
    

    // if(message.content === 'ping') {
    //     message.channel.send('pong');
    // }
    // if(message.content === '!connect' && message.member.voice.channel) {
    //     connection = joinVoiceChannel({
    //         channelId: message.member.voice.channelId,
    //         guildId: message.guildId,
    //         adapterCreator: message.guild.voiceAdapterCreator,
    //     })
    //     youtube_player.play('https://www.youtube.com/watch?v=FKzhORmAbLs', connection)
        
    // }
    // if(message.content === '!disconnect' && getVoiceConnection(message.guildId) !== undefined) {
    //     connection.destroy();
    // }
})

client.login(config.BOT_TOKEN)