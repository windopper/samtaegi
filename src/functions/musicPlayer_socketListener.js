const { SpeakingMap } = require('@discordjs/voice')
const { Players } = require('../commands/music_player_commands')
const musicPlayer_socketEmitter = require('./musicPlayer_socketEmitter')

function Listener(socket, io) {

    let guildId

    socket.on('requestData', s => {
        guildId = s
        
        if(Players.has(guildId)) {
            const guildSpace = io.of(`/${guildId}`)
            guildSpace.emit('fetchData', Players.get(guildId).getData())
        }
    })

    socket.on('pause', s => {
        guildId = s.guildId
        console.log('pause!')
        pause(guildId)
    })

    socket.on('unpause', s => {
        guildId = s.guildId
        unpause(guildId)
    })

    socket.on('skip', s => {
        guildId = s.guildId
        skip(guildId)
    })
}

function pause(guildId) {
    if(isValid(guildId)) {
        Players.get(guildId).audioPlayer.pause()
    }
}

function unpause(guildId) {
    if(isValid(guildId)) Players.get(guildId).audioPlayer.unpause()
}

function skip(guildId) {
    if(isValid(guildId)) Players.get(guildId).processQueue()
}

function isValid(guildId) {
    return Players.has(guildId)
}

module.exports = { 
    PlayerSocketListener: Listener
}