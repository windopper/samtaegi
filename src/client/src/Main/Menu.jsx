import { useEffect, useState, useRef } from 'react'
import './Menu.css'
import { io, Socket } from 'socket.io-client'
import { defaultSocket, guildSocket } from '../socket'

export default function Menu(param) {

    const guildId = param.guildId;
    const personalId = param.personalId;

    const [engine, setEngine] = useState('yt')
    const [loading, setLoading] = useState(false)
    const [deploycomplete, setDeployComplete] = useState(false)
    const [searching, setSearching] = useState(false)
    const text = useRef(' ')
    const [searchData, setSearchData] = useState([])
    const searchBoard = useRef(null)
    const timeref = useRef(0)
    const closetimeref = useRef(0)

    useEffect(() => {
        let socket = guildSocket(guildId)

        socket.on(`FETCH_YOUTUBE:${personalId}`, s => {
            setLoading(false)
            setSearchData(s)
        })
        socket.on(`DEPLOY_COMPLETE:${personalId}`, s => {
            console.log('deploy complete!')
            setDeployComplete(true)
            setTimeout(() => {
                setDeployComplete(false)
                setLoading(false)
            }, 2000)
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
            setLoading(true)
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
        setLoading(true)
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
            {loading && searching ? (
              <div className={!deploycomplete ? `loading` : `loading anim`}>

                {deploycomplete ? (
                  <div className={`wrapper`}>
                    {" "}
                    <svg
                      className="checkmark"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 52 52"
                    >
                      <circle
                        className="checkmark__circle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                      />
                      <path
                        className="checkmark__check"
                        fill="none"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                      />
                    </svg>
                  </div>
                ) : null}

              </div>
            ) : null}
            {searching ? (
                <div>
                    <i className="fa-brands fa-youtube" id='youtube' style={{
                        color: `${engine == 'yt' ? 'red' : 'black'}`
                    }} onClick={() => setEngine('yt')}></i>
                    <i className="fa-brands fa-soundcloud" id='soundcloud' style={{

                    }} onClick={() => setEngine('soundcloud')}></i>
                    <div className='search-text'>{`'${text.current}'  검색결과`}</div>
                </div>
            ) : null}
            {searching ? (
              <div className="close" onClick={closeSearching}></div>
            ) : null}
            {searching ? (
              <div className="search-container">{getSearchDatas()}</div>
            ) : null}
          </div>
        );
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
        {
            searchBoardContent()
        }
      </div>
    );
}