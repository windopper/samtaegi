const { Players } = require('../commands/music_player_commands')

function emitUpdateQueue(queue, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit('MUSIC_UPDATE_QUEUES', queue)
}

function emitProcessQueue(queue, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit('MUSIC_PROCESS_QUEUES', queue)
}

function emitRepeat(songrepeat, queuerepeat, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit('MUSIC_PLAYER_REPEAT', {
        songrepeat: songrepeat,
        queuerepeat: queuerepeat
    })
}

function emitSearchData(data, personalId, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit(`FETCH_YOUTUBE:${personalId}`, data)
}

function getGuildSpace(guildId, io) {
    return io.of(`/${guildId}`)
}

module.exports = {
    emitUpdateQueue: emitUpdateQueue,
    emitProcessQueue: emitProcessQueue,
    emitRepeat: emitRepeat,
    emitSearchData: emitSearchData
}