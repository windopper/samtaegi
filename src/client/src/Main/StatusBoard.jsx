import './StatusBoard.css'
import { defaultSocket } from '../socket'
import { useEffect, useState } from 'react'

export default function StatusBoard() {

    const [iconurls, setIconUrls] = useState([])

    useEffect(() => {
        defaultSocket.emit('REQUEST_GUILD_ICON', '')
        defaultSocket.on('GET_GUILD_ICON', v => {
            setIconUrls(v)
        })
    }, [])

    return (
        <div className='statusboard-container'>
            
        </div>
    )
}