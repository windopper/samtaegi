
import { useEffect, useState, useRef } from "react"
import { io } from 'socket.io-client'
import './Queue.css'
import Board from './Board'
import { defaultSocket, guildSocket } from '../socket'
import secToHMS from "../Util/SecToHMS"
import CheckRepeat from '../Util/CheckRepeat'
import { fetchData } from "../Util/fetchData"

export default function Queue(params) {

    const guildId = params.guildId
    const [queue, setQueue] = useState([])
    const fulltimeref = useRef('0')
    const [repeat, setRepeat] = useState('NONE')

    useEffect(() => {
        let time_2 = 0

        const cleanUp = () => {
            clearTimeout(time_2)
        }

        let socket = guildSocket(guildId)

        socket.on('MUSIC_PROCESS_QUEUES', s => {
            time_2 = setTimeout(() => {
                setfulltime(s)
                setQueue(s)
            }, 800)
        })
        
        socket.on('MUSIC_UPDATE_QUEUES', s => {
            setfulltime(s)
            setQueue(s)
        })

        socket.on('MUSIC_PLAYER_REPEAT', s => {
            setRepeat(CheckRepeat(s.queuerepeat, s.songrepeat))
        })

        fetchData(guildId).then((response) => {
            setRepeat(CheckRepeat(response.queuerepeat, response.songrepeat))
            setfulltime(response.queue)
            setQueue(response.queue)
        })

        return (
            cleanUp()
        )
    }, [])

    const setfulltime = (queue) => {
        let fulltime = 0
        queue.forEach((v) => fulltime += v.duration)
        fulltimeref.current = fulltime
    }
    
    const queues = () => {
        const divs = []
        for(let q = 0; q<queue.length; q++) {
            divs.push(
                <div className='queue' key={q} onClick={queueInfo}>
                    <img className='thumbnails' src={queue[q].thumbnails} alt='x'/>
                    <span>{queue[q].title}</span>
                    <span>{secToHMS(queue[q].duration)}</span>
                </div>
            )
        }
        return (
            divs
        )
    }

    const queueInfo = () => {

    }

    return (
        <div className='queue-container'> 
            <div className='queue-info'>
                <span>{`${queue.length} Tracks`} <span><i className="fa-solid fa-repeat"/> {repeat}</span></span>
                <span>{`${secToHMS(fulltimeref.current)}`}</span>
            </div>
        {
            queues()
        }
        </div>
    )
}