import './Controller.css'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'

const defaultSocket = io('http://localhost:5000')

export default function Controller(params) {

    const guildId = params.guildId

    const [pause, setPause] = useState(false)
    const [repeat, setRepeat] = useState('none')
    const [mouseenter, setMouseEnter] = useState(false)

    const socket = io(`http://localhost:5000/${guildId}`, { forceNew: true })

    useEffect(() => {
        defaultSocket.emit('requestData', guildId)
        socket.on('fetchData', s => {
            if(s.songrepeat) setRepeat('song')
            else if(s.queuerepeat) setRepeat('queue')
            else setRepeat('none')
        })
        socket.on('MUSIC_PLAYER_REPEAT', s => {
            if(s.songrepeat) setRepeat('song')
            else if(s.queuerepeat) setRepeat('queue')
            else setRepeat('none')
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

    const repeatIcon = () => {
        if(repeat === 'song') return <i className="fa-solid fa-repeat" onClick={cycleRepeat} id='repeat'></i>
        else if(repeat === 'queue') return <i className="fa-solid fa-repeat" id="repeat" onClick={cycleRepeat}></i>
        else return <i className="fa-solid fa-repeat" id='repeat' onClick={cycleRepeat}></i>
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
            {
                mouseenter ? (<div className='repeatinfo'><p>{repeat.toUpperCase()}</p></div>) : null
            }
        </div>
    )
}