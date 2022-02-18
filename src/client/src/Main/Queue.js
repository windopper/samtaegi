
import { useEffect, useState } from "react"
import { io } from 'socket.io-client'
import './Queue.css'
import Board from './Board'
import { defaultSocket, guildSocket } from '../socket'

export default function Queue(params) {

    const guildId = params.guildId
    const [queue, setQueue] = useState([])
    const [disappear, setDisappear] = useState(false)

    useEffect(() => {
        let socket = guildSocket(guildId)
        socket.on('fetchData', s => {
            setQueue(s.queue)
        })
        socket.on('MUSIC_PROCESS_QUEUES', s => {
            setTimeout(() => setDisappear(true), 300)
            
            setTimeout(() => {
                setQueue(s)
                setDisappear(false)
            }, 800)
        })
        socket.on('MUSIC_UPDATE_QUEUES', s => {
            setQueue(s)
        })
        defaultSocket.emit('requestData', guildId)
    }, [])
    
    const queues = () => {
        const divs = []
        for(let q = 0; q<queue.length; q++) {
            divs.push(
                <div className={disappear && q === 0 ? 'queue disappear' : 'queue'} key={q}>
                    <img className='thumbnails' src={queue[q].thumbnails} alt='x'/>
                    <span>{queue[q].title}</span>
                </div>
            )
        }
        return (
            divs
        )
    }

    return (
        <div className='queue-container'> 
        {
            queues()
        }
        </div>
    )
}