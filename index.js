const Discord = require('discord.js')
const express = require('express')
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
    client.user.setActivity("'/p' 로 음악 재생", {
        type: 'PLAYING'
    })
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
        console.log(err)
    }
})


client.on('messageCreate', (message) => {

    if(message.author.bot) return
    
    // basic_commands.listener(message)
    // music_player_commands.listener(message)

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

const app = express()
const path = require('path')
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'src/react-project/build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/react-project/build/index.html'))
    // res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example App Listening on port ${port}`)
})




client.login(process.env.BOT_TOKEN)

// const config = require('./config.json');
// client.login(config.BOT_TOKEN)

// const React = require('react')
// const ReactDom = require('react-dom')
// ReactDom.render(<h1>Hello React App</h1>, document.getElementById('root'));
