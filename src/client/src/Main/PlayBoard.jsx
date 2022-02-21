import { useEffect, useRef, useState } from 'react'
import { fetchData } from '../Util/fetchData'
import './PlayBoard.css'
import { getColors } from '../Util/ColorThief'
import { guildSocket } from '../socket'
import { Palette } from 'color-thief-react'

export default function PlayBoard(params) {

    const guildId = params.guildId
    const color = ['rgb(0, 0, 0)', 'rgb(100, 100, 100)', 'rgb(200, 200, 200)']
    const [info, setInfo] = useState([])

    useEffect(() => {

        let socket = guildSocket(guildId)

        socket.on('MUSIC_PROCESS_QUEUES', s => {
            console.log('processing')
            fetch()
        })

        socket.on('MUSIC_UPDATE_QUEUES', s => {
            fetch()
        })
 
        fetch()

    }, [])

    const fetch = () => {
        fetchData(guildId).then((response) => {
            if(response.queue.length >= 1) {
                setInfo(response.queue)
            }
        })
    }

    const lis = (data) => {
        let lises = []
        for(let i=0; i<10; i++) {
            lises.push(<li key={i} style={{
                background: `${data[2]}`,
                opacity: '0.2',
            }}></li>)
        }
        return (
            lises
        )
    }

    const getComponent = (data) => {
        return (
          <div
            className="area"
            style={{
              background: `linear-gradient(90deg,
               ${data[0]},
               ${data[1]})`,
            }}
          >
            <ul className="circles">{lis(data)}</ul>
            <div className="now-playing">현재 재생 중</div>
            <div className="music-name">{info[0].title}</div>
          </div>
        );
    }

    const getColorComponent = (data) => {
        return (
            <div
            className="area"
            style={{
              background: `linear-gradient(90deg,
               ${color[0]},
               ${color[1]})`,
            }}
            >
            <ul className="circles">{lis(data)}</ul>
            </div>
        )
    }

    const getPlayBoard = () => {
        if(info.length > 0) {
            try {
                return (
                    <Palette src={info[0].thumbnails} colorCount={3} crossOrigin='anonymous' format='rgbString'>
                      {({ data, loading }) => {
                          if(data == undefined) {
                              return getColorComponent(color)
                          } else {
                              return getComponent(data)
                          }
                      }}
                    </Palette>
                  );
            }
            catch(err) {
                return getColorComponent(color)
            }
        }
        else {
           return getColorComponent(color)
        }
    }


    return (
        getPlayBoard()
    );
}