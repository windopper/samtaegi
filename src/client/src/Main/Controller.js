import './Controller.css'
import { io } from 'socket.io-client'
import { useEffect, useState, useRef } from 'react'
import { defaultSocket, guildSocket } from '../socket'

export default function Controller(params) {

    const guildId = params.guildId

    const [pause, setPause] = useState(false)
    const [repeat, setRepeat] = useState('none')
    const [mouseenter, setMouseEnter] = useState(false)
    const [dura, setDura] = useState(0)
    const songdura = useRef(0)

    useEffect(() => {
        const socket = guildSocket(guildId)
        defaultSocket.emit('requestData', guildId)
        socket.on('fetchData', s => {
            if(s.songrepeat) setRepeat('song')
            else if(s.queuerepeat) setRepeat('queue')
            else setRepeat('none')
            songdura.current = s.queue.length >= 1 ? s.queue[0].duration : 0;
        })
        socket.on('MUSIC_PLAYER_REPEAT', s => {
            if(s.songrepeat) setRepeat('song')
            else if(s.queuerepeat) setRepeat('queue')
            else setRepeat('none')
        })
        socket.on(`MUSIC_PLAYBACKDURATION`, s => {
            console.log('get dura')
            setDura(s)
        })
    }, [])

    const cycleRepeat = () => {
        let data
        if(repeat === 'song') {
            setRepeat('queue')

            data = {
                guildId: guildId,
                repeat: 'queue'
            }
            console.log('queue')
        }
        else if(repeat === 'queue') {
            setRepeat('none')
            data = {
                guildId: guildId,
                repeat: 'none'
            }
            console.log('none')
        }
        else {
            setRepeat('song')
            data = {
                guildId: guildId,
                repeat: 'song'
            }
            console.log('song')
        }

        defaultSocket.emit('repeat', data)
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
            })
            setPause(false)
        }
        else {
            defaultSocket.emit('pause', {
                guildId: guildId,
            })
            setPause(true)
        }
        console.log('click pause')
    }

    const skip = () => {
        defaultSocket.emit('skip', {
            guildId: guildId
        })
        setPause(false)
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
            {
                mouseenter ? (<div className='repeatinfo'><p>{repeat.toUpperCase()}</p></div>) : null
            }
        </div>
    )
}