const { Players } = require('../commands/music_player_commands')

function emitUpdateQueue(queue, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit('MUSIC_UPDATE_QUEUES', queue)
}

function emitPlayBackDuration(value, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit('MUSIC_PLAYBACKDURATION', value)
}

function emitDeployComplete(personalId, guildId, io) {
    const guildSpace = getGuildSpace(guildId, io)
    guildSpace.emit(`DEPLOY_COMPLETE:${personalId}`, '')
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

function emitGuildIcon(iconUrls, guildId, io) {
    io.emit('GET_GUILD_ICON', iconUrls)
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
    emitSearchData: emitSearchData,
    emitDeployComplete: emitDeployComplete,
    emitPlayBackDuration: emitPlayBackDuration,
    emitGuildIcon: emitGuildIcon
}