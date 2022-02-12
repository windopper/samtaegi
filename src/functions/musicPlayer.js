const { createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, joinVoiceChannel } = require('@discordjs/voice')
const { VoiceChannel } = require('discord.js')
const ytdl = require('ytdl-core-discord')
const alert = require('../messages/music_message')

class MusicManager {
    voiceConnection
    audioPlayer
    queue

    constructor(VoiceConnection) {
        this.voiceConnection = VoiceConnection
        this.audioPlayer = createAudioPlayer()
        this.voiceConnection.subscribe(this.audioPlayer)
        this.queue = new Array()

        this.audioPlayer.on(
            'stateChange',
            (oldState, newState) => {
                if(oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
                    console.log('processQueue')
                    this.processQueue()
                }
                else if(newState.status === AudioPlayerStatus.Idle) {
                    this.processQueue()
                }
            }
        )
    }
    disconnect() {
        this.voiceConnection.disconnect()
        this.voiceConnection.destroy()
    }
    stop() {
        this.queue = new Array()
        this.audioPlayer.stop()
    }

    pause() {
        this.audioPlayer.pause()
    }
    
    unpause() {
        this.audioPlayer.unpause()
    }

    async addQueue(url, message) {
        if(ytdl.validateURL(url)) {

            let title

            await ytdl.getBasicInfo(url).then((e)=> {
                title = e.videoDetails.title
            })

            const queue = {
                url: url,
                title: title,
            }

            this.queue.push(queue)
            if(this.queue.length==1) this.play(queue.url)
            message.channel.send(alert.positive(queue.title+" 이(가) 성공적으로 큐에 등록되었습니다"))
        }
    }

    processQueue() {
        this.queue.shift()
        if(this.queue.length >= 1) {
            this.play(this.queue[0].url)
        }
    }

    async play(url) {
        const yt = await ytdl(url, {filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25})
        const resource = createAudioResource(yt, { inputType: StreamType.Opus })
        this.audioPlayer.play(resource)
    }

    showQueue(message) {
        if(this.queue.length==0) {
            message.channel.send(':x: 등록된 큐가 없습니다')
            return
        }
        let s = ''
        this.queue.forEach((v, i) => {
            s += i+' '+v.title+'\n'
        })
        message.channel.send(s);
    }

    skip(channel) {
        channel.send('skipped!')
        if(this.queue.length==0) {
            channel.send(alert.negative('스킵 할 음악이 없습니다'))
        }
        this.audioPlayer.stop()
    }


}

module.exports = {
    MusicManager: MusicManager
}