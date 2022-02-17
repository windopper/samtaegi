const playdl = require("play-dl")
const socketEmitter = require('./musicPlayer_socketEmitter')

async function YoutubeSearch(param, io) {
    const search = param.value
    const guildId = param.guildId
    const personalId = param.personalId
    const searched = await playdl.search(search, { source: { youtube: 'video'}})
    socketEmitter.emitSearchData(searched, personalId, guildId, io)
    console.log(searched.length)
}

module.exports = {
    YoutubeSearch: YoutubeSearch
}