import { useEffect, useState, useRef } from 'react'
import './Menu.css'
import { io, Socket } from 'socket.io-client'

const defaultSocket = io('http://localhost:5000')

export default function Menu(param) {

    const guildId = param.guildId;
    const personalId = param.personalId;
    const socket = io(`http://localhost:5000/${guildId}`, { forceNew: true })

    const [engine, setEngine] = useState('yt')
    const [searching, setSearching] = useState(false)
    const text = useRef(' ')
    const [searchData, setSearchData] = useState([])
    const searchBoard = useRef(null)
    const timeref = useRef(0)
    const closetimeref = useRef(0)

    useEffect(() => {
        socket.on(`FETCH_YOUTUBE:${personalId}`, s => {
            setSearchData(s)
        })
    }, [])

    const openSearching = () => {
        if(!searching) {
            searchBoard.current = 'searchboard'
            setSearching(true)
        }

    }

    const closeSearching = () => {
        if(searching) {
            searchBoard.current = 'searchboard disappear'
            setSearching(false)
            clearTimeout(closetimeref.current)
            closetimeref.current = setTimeout(() => {
                searchBoard.current = null
                setSearching(false)
            }, 500)
        }

    }

    const onChange = (e) => {
        let _text = e.target.value
        text.current = _text
        if(_text.length >= 2) {
            openSearching()
            clearTimeout(timeref.current)
            timeref.current = setTimeout(() => {
                defaultSocket.emit('SEARCH_YOUTUBE', {
                    personalId: personalId,
                    guildId: guildId,
                    value: _text
                })
            }, 500)
        }
        else {
            closeSearching()
        }
    }

    const handleClickSearch = () => {
        openSearching()
        defaultSocket.emit('SEARCH_YOUTUBE', {
            personalId: personalId,
            guildId: guildId,
            value: text.current
        })
    }



    function handleSendQueue(url) {
        console.log(url)
        defaultSocket.emit('DEPLOY_QUEUE', {
            guildId: guildId,
            personalId: personalId,
            url: url
        }) 
    }
        


    const getSearchDatas = () => {
        const divs = []
        console.log(searchData.length)
        let num = 0
        for(let data of searchData) {
            let title = data.title
            if(title.length > 40) title = title.substr(0, 39) + '...'
            divs.push(
              <div key={num} onClick={() => handleSendQueue(data.url)}>
                <img src={data.thumbnail.url} alt="x" />
                <div>
                  <span>{title}</span>
                  <span>{data.channel.name}</span>
                </div>
              </div>
            );
            num++
        }
        return (
            divs
        )
    }

    const searchBoardContent = () => {
        return (
            <div className={searchBoard.current}>
            {searching ? (
              <div className="close" onClick={closeSearching}></div>
            ) : null}
            {searching ? (
              <div className="search-container">{getSearchDatas()}</div>
            ) : null}
          </div>
        )
    }

    return (
      <div className={`search-box`}>
        <button className="btn-search" onClick={handleClickSearch}>
          <i className="fas fa-search" id="search-icon"></i>
        </button>
        <input
          type="text"
          className="input-search"
          placeholder="Search.."
          onChange={onChange}
        />

        {searchBoardContent()}


      </div>
    );
}