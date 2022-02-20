import { useEffect, useRef, useState } from 'react'
import { fetchData } from '../Util/fetchData'
import './PlayBoard.css'
import { getColors } from '../Util/ColorThief'
import { guildSocket } from '../socket'

const ColorThief = require('colorthief')

export default function PlayBoard(params) {

    const guildId = params.guildId
    const [update, setUpdate] = useState(false)
    const colorref = useRef([[0, 0, 0], [0, 0, 0], [0, 0, 0]])

    useEffect(() => {

        let socket = guildSocket(guildId)

        socket.on('MUSIC_PROCESS_QUEUES', s => {
            console.log('hi')
            fetch()
            setUpdate(!update)
        })

        fetch()

    }, [])

    const fetch = () => {
        fetchData(guildId).then((response) => {
            if(response.queue.length >= 1) {
                const img = new Image()

                let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
                img.crossOrigin = 'Anonymous';
                let imageURL = response.queue[0].thumbnails
                img.src = imageURL

                let root = document.getElementById('root')
                let container = root.getElementsByClassName('container')
                let queuecontainer = container[0].getElementsByClassName('queue-container')


                colorref.current = getColors(imageURL)
            }
            console.log('update')
            setUpdate(!update)
        })
    }

    const lis = () => {
        let lises = []
        for(let i=0; i<10; i++) {
            lises.push(<li key={i} style={{
                background: `rgb(${colorref.current[2][0]}, ${colorref.current[2][1]}, ${colorref.current[2][2]}, 0.2)`
            }}></li>)
        }
        return (
            lises
        )
    }

    return (
      <div
        className="area"
        style={{
          background: `linear-gradient(90deg,
                 rgb(${colorref.current[0][0]}, ${colorref.current[0][1]}, ${colorref.current[0][2]}),
                 rgb(${colorref.current[1][0]}, ${colorref.current[1][1]}, ${colorref.current[1][2]}))`,
        }}
      >
        <ul className="circles">
            {lis()}
        </ul>
      </div>
    );
}