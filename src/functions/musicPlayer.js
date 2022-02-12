const { createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, joinVoiceChannel } = require('@discordjs/voice')
const { VoiceChannel, MessageEmbed } = require('discord.js')
const ytdl = require('ytdl-core-discord')
const alert = require('../messages/music_message')
const playdl = require('play-dl')

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

    shuffle(message) {
        for(let i=this.queue.length-1; i>1; i--) {
            const randomPos = Math.floor(Math.random() * ( i + 1 ));
            const temporary = this.queue[i]
            this.queue[i] = this.queue[randomPos]
            this.queue[randomPos] = temporary
        }
        message.channel.send(":white_check_mark: 셔플 완료!")
    }

    async addQueue(url, message) {

        let title
        let thumbnails

        if(await playdl.yt_validate(url)) {
            const info = playdl.video_basic_info(url)


        }
        else if(await playdl.so_validate(url)) {

        }

        if(await playdl.validate(url)) {

            let title
            let thumbnails

            const info = playdl.video_info

            await ytdl.getBasicInfo(url).then((e)=> {
                title = e.videoDetails.title
                thumbnails = e.videoDetails.thumbnails[0].url
            })

            const queue = {
                url: url,
                title: title,
                thumbnails: thumbnails
            }

            this.queue.push(queue)
            if(this.queue.length==1) this.play(queue.url)
            message.channel.send(alert.positive('**'+queue.title+"** 이(가) 성공적으로 큐에 등록되었습니다"))
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
        const pd = await playdl.stream(url, { quality: 2, discordPlayerCompatibility: true})
        const resource = createAudioResource(pd.stream, { inputType: pd.type })
        this.audioPlayer.play(resource)
    }

    showQueue(message) {
        if(this.queue.length==0) {
            message.channel.send(':x: 등록된 큐가 없습니다')
            return
        }
        let s = ''
        this.queue.forEach((v, i) => {
            if(i===0) {
                s+= '현재 재생 중 - **'+v.title+'**\n'
            }
            else {
                s += i+'. **'+v.title+'**\n'
            }

        })
        message.channel.send(s);
    }

    skip(channel) {
        let title = this.queue[0].title
        let nextTitle = this.queue[1].title
        channel.send('**'+title+'** 이(가) 스킵되었습니다!')
        channel.send('다음 음악 : **'+nextTitle+'**')
        if(this.queue.length==0) {
            channel.send(alert.negative('스킵 할 음악이 없습니다'))
        }
        this.audioPlayer.stop()
    }


}

module.exports = {
    MusicManager: MusicManager
}