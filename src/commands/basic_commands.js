const music_player_commands = require('./music_player_commands')

function listener(message) {
    if(message.content === '!help') {
        message.channel.send('help')
    }
}

module.exports = {
    listener: listener
}