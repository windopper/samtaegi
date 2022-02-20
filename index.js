const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const basic_commands = require('./src/commands/basic_commands')
const music_player_commands = require('./src/commands/music_player_commands')
const webshot = require('node-webshot')
const play = require('play-dl')
const file = require('./src/designs/musicQueue');
const { deploy_commands } = require('./deploy-commands')
const { menuSelect } = require('./src/functions/musicMenuSelect')
const { PlayerSocketListener } = require('./src/functions/musicPlayer_socketListener')

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

const test = require("./src/server/test")
const port = process.env.PORT || 5000

app.use(test)
app.get('/', (req, res) => {
    res.send('hi')
})

io.on('connection', (socket) => {
    console.log('new connection!')
    console.log(music_player_commands.Players.size)

    PlayerSocketListener(socket, io, client)
})


server.listen(port, () => {
    console.log(`Socket IO server Listening on port ${port}`)
})

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity("'/p' 로 음악 재생", {
        type: 'PLAYING'
    })

    setInterval(() => server.getConnections((er, n) => console.log(n)), 2000)

    // deploy_commands()
});

client.on('interactionCreate', async interaction => {

    if(interaction.isSelectMenu()) {
        menuSelect(interaction, io)
    }
    else if(!interaction.isCommand()) return;

    
    try {
        music_player_commands.listener(interaction, io)
        console.log(music_player_commands.Players.keys.length)
    }
    catch(err) {
        interaction.reply({
            content: '오류가 발생하였습니다'
        })
        console.log(err)
    }
})

// client.login(process.env.BOT_TOKEN)

const config = require('./config.json');
const { isObject } = require('util');
client.login(config.BOT_TOKEN)

module.exports = {
    io: io
}

