
import { useEffect, useState } from "react"
import { io } from 'socket.io-client'
import './Queue.css'
import Board from './Board'

const defaultSocket = io('http://localhost:5000')

export default function Queue(params) {

    const guildId = params.guildId
    const socket = io(`http://localhost:5000/${guildId}`, { forceNew: true })

    const [queue, setQueue] = useState([])
    const [disappear, setDisappear] = useState(false)

    useEffect(() => {
        defaultSocket.emit('requestData', guildId)
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
            {/* <Board queue={queue}/> */}
        {
            queues()
        }
      </div>
    )
}