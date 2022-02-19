
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
        let time_1 = 0
        let time_2 = 0
        const cleanUp = () => {
            clearTimeout(time_1)
            clearTimeout(time_2)
        }
        let socket = guildSocket(guildId)
        socket.on('fetchData', s => {
            setQueue(s.queue)
        })
        socket.on('MUSIC_PROCESS_QUEUES', s => {
            time_1 = setTimeout(() => setDisappear(true), 300)
            time_2 = setTimeout(() => {
                setQueue(s)
                setDisappear(false)
            }, 800)
        })
        socket.on('MUSIC_UPDATE_QUEUES', s => {
            setQueue(s)
        })
        defaultSocket.emit('requestData', guildId)
        return (
            cleanUp()
        )
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
            <div className='queue-info'></div>
        {
            queues()
        }
        </div>
    )
}