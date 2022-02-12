const { joinVoiceChannel } = require('@discordjs/voice')
const { MusicManager } = require('../functions/musicPlayer')

const Players = new Map()

function listener(message, client) {
    let contents = message.content.split(" ")
    let guildId = message.guildId

    if(Players.has(guildId)) {
        let player = Players.get(guildId)

        if(message.content === '!disconnect') {
             player.disconnect();
             Players.delete(guildId)
        }
        else if(message.content === '!stop') {
            player.stop();
        }
        else if(message.content === '!shuffle') {
            player.shuffle(message);
        }
        else if(message.content === '!pause') {
            player.pause();
        }
        else if(message.content === '!unpause') {
            player.unpause();
        }
        else if(message.content === '!list') {
            player.showQueue(message);
        }
        else if(message.content === '!skip') {
            player.skip(message.channel);
        }
        else if(contents.length === 2) {
            if(contents[0] === '!yt') {
                player.addQueue(contents[1], message)
            }
        }
    }
    else {
        if(message.content === '!connect') {
            if(message.member.voice.channel) {
                initializer(message)
            }
            else {
                message.channel.send(`:x: ${message.author.username}님이 음성채널에 없습니다`)
            }
        }
        else if(contents.length === 2) {
            if(contents[0] === '!yt') {
                initializer(message)
                let player = Players.get(guildId)
                player.addQueue(contents[1], message)
            }
        }
    }
}

function initializer(message) {
    let guildId = message.guildId
    Players.set(guildId, new MusicManager(
        joinVoiceChannel({
            channelId: message.member.voice.channelId,
            guildId: message.guildId,
            adapterCreator: message.guild.voiceAdapterCreator,
        })
    ))
}

module.exports = {
    listener: listener
}