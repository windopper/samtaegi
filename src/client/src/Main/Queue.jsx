
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
    const repeat = useRef('')

    useEffect(() => {
        let time_2 = 0
        const cleanUp = () => {
            clearTimeout(time_2)
        }
        let socket = guildSocket(guildId)

        socket.on('MUSIC_PROCESS_QUEUES', s => {
            time_2 = setTimeout(() => {
                let fulltime = 0
                s.forEach((v) => fulltime += v.duration)
                fulltimeref.current = fulltime

                setQueue(s)
            }, 800)
        })
        socket.on('MUSIC_UPDATE_QUEUES', s => {
            setQueue(s)
        })

        fetchData(guildId).then((response) => {
            console.log(response.queue.length)
            let fulltime = 0
            response.queue.forEach((v) => fulltime += v.duration)
            fulltimeref.current = fulltime
            repeat.current = CheckRepeat(response.queuerepeat, response.songrepeat)

            setQueue(response.queue)
        })
        return (
            cleanUp()
        )
    }, [])
    
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
                <span>{`${queue.length} Tracks`} <span><i className="fa-solid fa-repeat"/> {repeat.current}</span></span>
                <span>{`${secToHMS(fulltimeref.current)}`}</span>
            </div>
        {
            queues()
        }
        </div>
    )
}