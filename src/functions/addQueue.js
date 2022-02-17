const playdl = require('play-dl')
const socketEmitter = require('../functions/musicPlayer_socketEmitter')
const musicPlayer_socketEmitter = require('../functions/musicPlayer_socketEmitter')

async function addQueue(url, Player, io, guildId) {
    
    let title
    let duration
    let thumbnails
    /**
     * YouTube url listener
     */
    if(url.startsWith('http') && await playdl.yt_validate(url) == 'video') {
        await playdl.video_basic_info(url).then((e)=> {
            title = e.video_details.title
            duration = e.video_details.durationInSec,
            thumbnails = e.video_details.thumbnails[0].url
            
        });

        const queue = {
            url: url,
            title: title,
            duration: duration,
            thumbnails: thumbnails
        }

        Player.queue.push(queue)
        if(Player.queue.length==1) Player.play(queue.url)

        socketEmitter.emitUpdateQueue(Player.queue, guildId, io)
        return
    }
    else if(url.startsWith('http') && await playdl.yt_validate(url) == 'playlist') {
        let trackName
        let tracks
        let trackCount
        
        await playdl.playlist_info(url, { incomplete: true }).then((e) => {
            trackName = e.title
            trackCount = e.total_videos
        })

        tracks = await (await playdl.playlist_info(url, { incomplete: true })).all_videos()

        for(let track of tracks) {
            let queue = {
                url: track.url,
                title: track.title,
                duration: track.durationInSec,
                thumbnails: track.thumbnails[0].url
            }
            Player.queue.push(queue)
            if(Player.queue.length==1) Player.play(queue.url)
        }
    
        socketEmitter.emitUpdateQueue(Player.queue, guildId, io)
        return
    }
    /**
     * 유튜브 검색
     */
    /**
     * 
     * Get SoundCloud Free Client when youtube url is not valid
     * 
     */
    await playdl.getFreeClientID().then((clientID) => playdl.setToken({
        soundcloud: {
            client_id: clientID
        }
    }))

    let so_validate = await playdl.so_validate(url)
    /**
     * SoundCloud url listener
     * 
     */

    if(url.startsWith('http') && so_validate == 'track') {
        await playdl.soundcloud(url).then((e)=> {
            title = e.user.name+' - '+e.name
            duration = e.durationInSec
            thumbnails = e.thumbnail
        })

        const queue = {
            url: url,
            title: title,
            duration: duration,
            thumbnails: thumbnails
        }

        Player.queue.push(queue)
        if(Player.queue.length==1) Player.play(queue.url)

        socketEmitter.emitUpdateQueue(Player.queue, guildId, io)
        return

    }
    /**
     * SoundCloud PlayList url listener
     * 
     */
    if(url.startsWith('http') && so_validate == 'playlist') {

        let tracks
        let trackName
        let trackCount
        await playdl.soundcloud(url).then((e)=> {
            trackName = e.name
            trackCount = e.tracksCount
        })
        let soundcloud = await playdl.soundcloud(url)
        tracks = await soundcloud.all_tracks()

        for(let track of tracks) {
            let queue = {
                url: track.url,
                title: track.user.name+' - '+track.name,
                duration: track.durationInSec,
                thumbnails: track.thumbnail
            }
            Player.queue.push(queue)
            if(Player.queue.length==1) Player.play(queue.url)
        }

        socketEmitter.emitUpdateQueue(Player.queue, guildId, io)
        return
    }

}

module.exports = {
    addQueue: addQueue,
}