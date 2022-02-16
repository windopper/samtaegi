import './Controller.css'
import { io } from 'socket.io-client'
import { useState } from 'react'

const defaultSocket = io('http://localhost:5000')

export default function Controller(params) {
    const guildId = params.guildId
    const [pause, setPause] = useState(false)

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
    }

    return (
        <div className='controller'>
            <button className={ pause ? 'pausebtn paused' : 'pausebtn pause'} onClick={pausefunc}></button>
            <i className="fa-solid fa-forward-step"></i>
        </div>
    )
}