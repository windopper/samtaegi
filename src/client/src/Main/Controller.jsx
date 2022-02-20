import './Controller.css'
import { io } from 'socket.io-client'
import { useEffect, useState, useRef } from 'react'
import { defaultSocket, guildSocket } from '../socket'
import { fetchData } from '../Util/fetchData'

export default function Controller(params) {

    const guildId = params.guildId

    const [pause, setPause] = useState(false)
    const [repeat, setRepeat] = useState('none')
    const [mouseenter, setMouseEnter] = useState(false)
    const [dura, setDura] = useState(0)
    const songdura = useRef(0)

    useEffect(() => {
        const socket = guildSocket(guildId)
        // socket.on('fetchData', s => {
        //     if(s.songrepeat) setRepeat('song')
        //     else if(s.queuerepeat) setRepeat('queue')
        //     else setRepeat('none')
        //     songdura.current = s.queue.length >= 1 ? s.queue[0].duration : 0;
        // })
        socket.on('MUSIC_PLAYER_REPEAT', s => {
            if(s.songrepeat) setRepeat('song')
            else if(s.queuerepeat) setRepeat('queue')
            else setRepeat('none')
        })
        socket.on(`MUSIC_PLAYBACKDURATION`, s => {
            fetching()
            setDura(s)
        })

        fetching()


        // defaultSocket.emit('requestData', guildId, (response) => {
        //     if(response.songrepeat) setRepeat('song')
        //     else if(response.queuerepeat) setRepeat('queue')
        //     else setRepeat('none')
        //     songdura.current = response.queue.length >=1 ? response.queue[0].duration : 0;
        // })
    }, [])

    const fetching = () => {
        fetchData(guildId).then((response) => {
            if (response.songrepeat) setRepeat("song");
            else if (response.queuerepeat) setRepeat("queue");
            else setRepeat("none");
            songdura.current = response.queue.length >=1 ? response.queue[0].duration : 0;
        })
    }

    const cycleRepeat = () => {
        let data
        if(repeat === 'song') {
            setRepeat('queue')

            data = {
                guildId: guildId,
                repeat: 'queue'
            }
        }
        else if(repeat === 'queue') {
            setRepeat('none')
            data = {
                guildId: guildId,
                repeat: 'none'
            }
        }
        else {
            setRepeat('song')
            data = {
                guildId: guildId,
                repeat: 'song'
            }
        }

        defaultSocket.emit('repeat', data, (response) => {})
    }

    const enter = () => {
        setMouseEnter(true)
    }

    const leave = () => {
        setMouseEnter(false)
    }

    const pausefunc = () => {
        if(pause) {
            defaultSocket.emit('unpause', {
                guildId: guildId
            }, (response) => {})
            setPause(false)
        }
        else {
            defaultSocket.emit('pause', {
                guildId: guildId,
            }, (response) => {})
            setPause(true)
        }
        console.log('click pause')
    }

    const skip = () => {
        defaultSocket.emit('skip', {
            guildId: guildId
        }, (response) => {})
        setPause(false)
    }

    function secToHMS(sec) {
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

    return (
        <div className='controller'>
            <button className={ pause ? 'pausebtn pause' : 'pausebtn paused' } onClick={pausefunc}></button>
            <i className="fa-solid fa-forward-step" id="skip" onClick={skip}></i>
            <i className="fa-solid fa-repeat" id='repeat' onClick={cycleRepeat} onMouseEnter={enter} onMouseLeave={leave}></i>
            <div className='audio-slide'>
                <div className='audio-bar' style={{
                    left: `${dura/1000 < songdura.current ? dura/1000 / songdura.current * 100 : 0}%`,
                }}></div>
            </div>
            <div className='audio-progress-num'>{`${secToHMS(parseInt(dura/1000))} / ${secToHMS(songdura.current)}`}</div>
            {
                mouseenter ? (<div className='repeatinfo'><p>{repeat.toUpperCase()}</p></div>) : null
            }
        </div>
    )
}