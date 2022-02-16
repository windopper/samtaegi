const { Players } = require('../commands/music_player_commands')

function emitQueue(queue, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit('MUSIC_PLAYER_QUEUES', queue)
}

function emitRepeat(songrepeat, queuerepeat, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit('MUSIC_PLAYER_REPEAT', {
        songrepeat: songrepeat,
        queuerepeat: queuerepeat
    })
}

function getGuildSpace(guildId, io) {
    return io.of(`/${guildId}`)
}

module.exports = {
    emitQueue: emitQueue,
    emitRepeat: emitRepeat
}