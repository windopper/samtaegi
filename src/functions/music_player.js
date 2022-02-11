const { createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } = require('@discordjs/voice')
const ytdl = require('ytdl-core-discord')

let connection
let player
let Queue = new Array()

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

function disconnect() {
    connection.disconnect()
}

async function play(link) {
    if(ytdl.validateURL(link)) {
        player = createAudioPlayer();
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
    player.stop();
}

function pause() {
    player.pause();
}

function unpause() {
    player.unpause();
}

function addQueue(url, message) {
    if(ytdl.validateURL(url)) {
        const queue = {
            url: url,
            title: ytdl.getBasicInfo(url).then((e) => {
              return e.videoDetails.title;
            }),
          };
        Queue.push(queue)
    }
    else {
        message.channel.send(":x: 올바른 형식의 URL이 아닙니다")
    }
}

function skip(message) {
    message.channel.send('skiped!')
    Queue.shift();
}

function removeQueue() {
    
}

function showQueue(message) {
    if(Queue.length == 0) {
        message.channel.send(':x: 등록된 큐가 없습니다')
        return
    }
    Queue.forEach((v, i)=> {
        message.channel.send(i+' '+v);
    })
}

module.exports = {
    play: play,
    connect: connect,
    disconnect: disconnect,
    stop: stop,
    pause: pause,
    unpause: unpause,
    addQueue: addQueue,
    removeQueue: removeQueue,
    showQueue: showQueue,
    skip: skip
}

