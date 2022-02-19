import './StatusBoard.css'
import { defaultSocket } from '../socket'
import { useEffect, useState } from 'react'

export default function StatusBoard() {

    const [iconurls, setIconUrls] = useState([])

    useEffect(() => {
        defaultSocket.emit('REQUEST_GUILD_ICON', '')
        defaultSocket.on('GET_GUILD_ICON', v => {
            setIconUrls(v)
            console.log(`get ${v.length}`)
        })
    }, [])

    const guildIcons = () => {
        const divs = []
        let key = 0
        for(let iconurl of iconurls) {
            divs.push(
              <div className="guilds" key={key}>
                <img src={iconurl} alt="x" />
              </div>
            );
            key++
        }
        return (
            divs
        )
    }

    return (
        <div className='statusboard-container'>
            {guildIcons()}
        </div>
    )
}