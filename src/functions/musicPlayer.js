const { createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice')
const { VoiceChannel, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const ytdl = require('ytdl-core-discord')
const alert = require('../messages/music_message')
const playdl = require('play-dl')
const socketEmitter = require('../functions/musicPlayer_socketEmitter')
const musicPlayer_socketEmitter = require('../functions/musicPlayer_socketEmitter')
const { emitPlayBackDuration } = require('../functions/musicPlayer_socketEmitter')
const music_player_commands = require('../commands/music_player_commands')

class MusicManager {

    guildId
    io
    voiceConnection
    audioPlayer
    queue
    intervalId = 0
    queuerepeat = false
    songrepeat = false
    pause = false

    constructor(VoiceConnection, io, guildId) {
        this.guildId = guildId
        this.io = io
        this.voiceConnection = VoiceConnection
        this.audioPlayer = createAudioPlayer()

        this.voiceConnection.subscribe(this.audioPlayer)
        this.queue = new Array()

        this.voiceConnection.on(VoiceConnectionStatus.Destroyed, () => {
            music_player_commands.Players.delete(guildId)
            clearInterval(this.intervalId)
        })

        this.voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
            this.voiceConnection.destroy()
            clearInterval(this.intervalId)
        })

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
    disconnect(interaction) {
        this.voiceConnection.disconnect()
        clearInterval(this.intervalId)
        interaction.reply({
            content: ':x: ?????? ????????? ?????????????????????'
        })
    }
    stop(interaction) {
        this.queue = new Array()
        this.audioPlayer.stop()
        interaction.reply({
            content: ':x: ?????? ?????? ???????????? ????????? ?????????????????????'
        })
    }

    pause(interaction) {
        this.audioPlayer.pause()
        this.pause = true
        interaction.reply({
            content: ':pause_button: ????????? ???????????? ??????????????? `/unpause`??? ?????? ????????? ??? ????????????'
        })
    }
    
    unpause(interaction) {
        this.audioPlayer.unpause()
        this.pause = false
        interaction.reply({
            content: ':arrow_forward: ????????? ?????????????????????'
        })
    }

    shuffle(interaction) {
        for(let i=this.queue.length-1; i>1; i--) {
            const randomPos = Math.floor(Math.random() * ( i - 1 ) + 1);
            const temporary = this.queue[i]
            this.queue[i] = this.queue[randomPos]
            this.queue[randomPos] = temporary
        }
        interaction.reply({
            content: ':white_check_mark: ?????? ??????!'
        })
    }

    async addQueue(url, interaction) {

        await interaction.deferReply()
        
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
                thumbnails = thumbnails = e.video_details.thumbnails[0].url
            });

            const queue = {
                url: url,
                title: title,
                duration: duration,
                thumbnails: thumbnails
            }

            this.queue.push(queue)
            if(this.queue.length==1) this.play(queue.url)

            interaction.editReply({
                content: alert.positive('**'+queue.title+"** ???(???) ??????????????? ?????? ?????????????????????")
            })
            socketEmitter.emitUpdateQueue(this.queue, this.guildId, this.io)
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
                this.queue.push(queue)
                if(this.queue.length==1) this.play(queue.url)
            }
            
            interaction.editReply({
                content: alert.positive("**[ "+trackName+" ]** ?????????????????? **"+trackCount+"???** ???(???) ??????????????? ?????? ?????????????????????")
            })
            socketEmitter.emitUpdateQueue(this.queue, this.guildId, this.io)
            return
        }
        /**
         * ????????? ??????
         */
        else if(await playdl.yt_validate(url) == 'search') {
            const searched = await playdl.search(url, { source: { youtube: 'video'}, limit: 5})

            let menus = []
            let count = 1
            for(let video of searched) {
                menus.push(
                    {
                        label: video.title,
                        description: 'YouTubeVideo | ??????: ['+this.secToHMS(video.durationInSec)+']',
                        value: video.url
                    }
                )
            }
            

            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('track select')
                        .setPlaceholder('???????????? ?????? 5??? ??? ????????? ??????????????????')
                        .addOptions(menus)
                )
            
            if(menus.length > 0) {
                interaction.editReply({
                     content: "'"+url+"' ??? ?????? ?????? ?????? 5?????? ??????????????????",
                    components: [row],
                })
            }
            else {
                interaction.editReply({
                    content: "'"+url+"' ??? ?????? ?????? ????????? ???????????? :scream::scream::scream:",
                    components: [],
                })
            }


            return
        }
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

            this.queue.push(queue)
            if(this.queue.length==1) this.play(queue.url)

            interaction.editReply({
                content: alert.positive('**'+queue.title+"** ???(???) ??????????????? ?????? ?????????????????????")
            })
            socketEmitter.emitUpdateQueue(this.queue, this.guildId, this.io)
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
                this.queue.push(queue)
                if(this.queue.length==1) this.play(queue.url)
            }
            
            interaction.editReply({
                content: alert.positive("**[ "+trackName+" ]** ?????????????????? **"+trackCount+"???** ???(???) ??????????????? ?????? ?????????????????????")
            })
            socketEmitter.emitUpdateQueue(this.queue, this.guildId, this.io)
            return
        }

        interaction.editReply({
            content: alert.negative('???????????? ?????? url ???????????????. *?????? ?????? [ YouTubeVideo | YouTubePlayList | SoundCloudTrack | SoundCloudPlayList | YouTubeSearch ]*')
        })
    }

    processQueue() {
        clearInterval(this.intervalId)
        let shift
        if(!this.songrepeat) {
           shift = this.queue.shift()
        }
        if(this.queuerepeat) {
            this.queue.push(shift)
        }
        if(this.queue.length >= 1) {
            if(this.queue[0] != undefined) this.play(this.queue[0].url)
        }
        else this.audioPlayer.stop()
        
        socketEmitter.emitProcessQueue(this.queue, this.guildId, this.io)
    }

    async play(url) {
        const pd = await playdl.stream(url, { quality: 2, discordPlayerCompatibility: true})
        const resource = createAudioResource(pd.stream, { inputType: pd.type })
        this.intervalId = setInterval(() => {
            emitPlayBackDuration(resource.playbackDuration, this.guildId, this.io)
        }, 500)
        this.audioPlayer.play(resource)
    }

    showQueue(interaction) {
        if(this.queue.length==0) {
            interaction.reply({
                content: ':x: ????????? ?????? ????????????'
            })
            return
        }
        let s = ''
        let repeat = '\n'
        let i = 0

        if(this.songrepeat) repeat = "`?????? ?????? ??????: ????????????`\n\n"
        else if(this.queuerepeat) repeat = "`?????? ?????? ??????: ????????????`\n\n"

        for(let q of this.queue) {
            let temp = s
            if(i===0) {
                s+= '?????? ?????? ??? - **'+q.title+'** ['+this.secToHMS(q.duration)+']\n'+repeat
            }
            else {
                s += i+'. **'+q.title+'** ['+this.secToHMS(q.duration)+']\n'
            }
            if(s.length > 1950) {
                temp += '\n..??? '+(this.queue.length - i)+'???'
                s = temp
                break
            }
            i++
        }

        interaction.reply({
            content: s
        })
    }

    secToHMS(sec) {
        let h
        let m
        let s
        h = String(Math.floor(sec / 3600))
        if(h.length == 1) h = '0'+h
        sec = sec % 3600
        m = String(Math.floor(sec / 60))
        if(m.length == 1) m = '0'+m
        sec = sec % 60
        s = String(sec)
        if(s.length == 1) s = '0'+s
        if(h==0) {
            return (
                m+':'+s
            )
        }
        return (
            h+':'+m+':'+s
        )
    }

    skip(interaction) {
        
        if(this.queue.length==0) {
            interaction.reply({
                content: alert.negative('?????? ??? ????????? ????????????')
            })
        }
        else if(this.queue.length==1) {
            let title = this.queue[0].title

            if(this.songrepeat || this.queuerepeat) {
                interaction.reply({
                    content: '**'+title+'** ???(???) ?????????????????????!\n:arrow_forward: ?????? ??????: **'+title+'**'
                })
            }
            interaction.reply({
                content: '**'+title+'** ???(???) ?????????????????????!'
            })
        }
        else {
            let title = this.queue[0].title
            let nextTitle
            if(this.songrepeat) nextTitle = this.queue[0].title
            else nextTitle = this.queue[1].title

            interaction.reply({
                content: '**'+title+'** ???(???) ?????????????????????!\n:arrow_forward: ?????? ??????: **'+nextTitle+'**'
            })
        }
        this.audioPlayer.stop()
    }

    repeat(interaction, keyword) {
        if(keyword == 'none') {
            this.songrepeat = false
            this.queuerepeat = false
            interaction.reply({
                content: alert.positive('?????? ????????? ?????????????????????')
            })
        }
        else if(keyword == 'song') {
            this.songrepeat = true
            this.queuerepeat = false
            interaction.reply({
                content: alert.positive('?????? ????????? "?????? ??????"?????? ?????????????????????')
            })
        }
        else if(keyword == 'queue') {
            this.songrepeat = false
            this.queuerepeat = true
            interaction.reply({
                content: alert.positive('?????? ????????? "?????? ??????"?????? ?????????????????????')
            })
        }
        musicPlayer_socketEmitter.emitRepeat(this.songrepeat, this.queuerepeat, this.guildId, this.io)
    }

    getData() {
        return {
            queue: this.queue,
            songrepeat: this.songrepeat,
            queuerepeat: this.queuerepeat,
            pause: this.pause,
        }
    }
}

module.exports = {
    MusicManager: MusicManager
}