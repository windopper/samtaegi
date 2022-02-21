const playdl = require("play-dl")
const socketEmitter = require('./musicPlayer_socketEmitter')

async function YoutubeSearch(search, callback) {
    await playdl.search(search, { source: { youtube: 'video'}})
        .then(v => {
            console.log(v.length)
            callback (
                v
            )
        })
}

async function SoundCloudSearch(text, callback) {
    await playdl.getFreeClientID().then((clientID) => playdl.setToken({
        soundcloud: {
            client_id: clientID
        }
    }))
    await playdl.search(text, { source: { soundcloud: 'tracks'}})
        .then(v => {
            callback(
                v
            )
        })
}

module.exports = {
    YoutubeSearch: YoutubeSearch,
    SoundCloudSearch: SoundCloudSearch
}