const music_player = require('../functions/music_player')

function listener(message) {
    contents = message.content.split()
    if(message.content === '!connect') {
        if(message.member.voice.channel) {
            
        }
        else {
            // 
        }
    }
    else if(message.content === '!stop') {
        
    }
    else if(message.content === '!pause') {

    }
    else if(message.content) {
        
    }
}

module.exports = {
    listener: listener
}