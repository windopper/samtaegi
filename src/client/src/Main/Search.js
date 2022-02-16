// const playdl = require('play-dl')
import { useState } from 'react'
import './Search.css'

export default function Search() {

    const [fold, setFold] = useState(true)

    const clickSearch = () => {

    }

    return (
        <div className='container'>
            <input placeholder='Type Keywords'></input>
        </div>
    )
}