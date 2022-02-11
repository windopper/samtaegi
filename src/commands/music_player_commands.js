const music_player = require('../functions/music_player')

function listener(message, client) {
    let contents = message.content.split(" ")
    if(message.content === '!connect') {
        if(message.member.voice.channel) {
            music_player.connect(message.member.voice.channelId, message.guildId, message.guild.voiceAdapterCreator);
        }
        else {
            message.channel.send(`:x: ${message.author.username}님이 음성채널에 없습니다`)
        }
    }
    else if(message.content === '!disconnect') {
         music_player.disconnect();
    }
    else if(message.content === '!stop') {
        music_player.stop();
    }
    else if(message.content === '!pause') {
        music_player.pause();
    }
    else if(message.content === '!unpause') {
        music_player.unpause();
    }
    else if(message.content === '!list') {
        music_player.showQueue(message);
    }
    else if(message.content === '!skip') {
        music_player.skip(message);
    }
    else if(contents.length === 2) {
        if(contents[0] === '!yt') {
            music_player.addQueue(contents[1], message)
        }
    }
}

module.exports = {
    listener: listener
}