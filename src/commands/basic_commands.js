
function listener(message) {
    if(message.content === '!help') {
        message.channel.send('help')
    }
}

module.exports = {
    listener: listener
}