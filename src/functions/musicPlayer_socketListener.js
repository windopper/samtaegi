const { SpeakingMap } = require('@discordjs/voice')
const { Players } = require('../commands/music_player_commands')
const { emitRepeat } = require('./musicPlayer_socketEmitter')
const musicPlayer_socketEmitter = require('./musicPlayer_socketEmitter')
const musicSearch = require("./musicSearch")
const addQueue = require('./addQueue')

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

    socket.on('repeat', s => {
        guildId = s.guildId
        repeat(guildId, s.repeat)
    })

    socket.on('SEARCH_YOUTUBE', s => {
        guildId = s.guildId
        musicSearch.YoutubeSearch(s, io)
    })

    socket.on('DEPLOY_QUEUE', s => {
        guildId = s.guildId
        let url = s.url
        if(isValid(guildId)) {
            addQueue.addQueue(url, Players.get(guildId), io, guildId)
        }
    })
}

function repeat(guildId, repeat) {
    if(isValid(guildId)) {
        if(repeat === 'song') {
            Players.get(guildId).songrepeat = true
            Players.get(guildId).queuerepeat = false
        }
        else if(repeat === 'queue') {
            Players.get(guildId).songrepeat = false
            Players.get(guildId).queuerepeat = true
        }
        else {
            Players.get(guildId).songrepeat = false
            Players.get(guildId).queuerepeat = false
        }
    }
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