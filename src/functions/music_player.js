const { createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } = require('@discordjs/voice')
const ytdl = require('ytdl-core-discord')

let connection

function getConnection(channelId, guildId, adapterCreator) {
    connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: adapterCreator
    })
}

async function connect(channelId, guildId, adapterCreator) {
    getConnection(channelId, guildId, adapterCreator)
}

async function play(link, connection) {
    if(ytdl.validateURL(link)) {
        const player = createAudioPlayer();
        const yt = await ytdl(link, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25})
        const resource = createAudioResource(yt, { inputType: StreamType.Opus })
        connection.subscribe(player)
        player.play(resource)
    }
    else {
        // 잘못된 link 형식 입니다
    }

}

function stop() {

}

function pause() {

}

function addQueue() {

}

function removeQueue() {

}

function showQueue() {
    
}

module.exports = {
    play: play,
    connect: connect,
    stop: stop,
    pause: pause,
    addQueue: addQueue,
    removeQueue: removeQueue,
    showQueue: showQueue
}

