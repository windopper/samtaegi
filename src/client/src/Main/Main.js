import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import './Main.css'
import Search from './Search'
import Queue from './Queue'
import Controller from './Controller'
import Menu from './Menu'
import Board from './Board'


function Main() {

    const param = useParams()

    return (
        <div className='container'>
            <Queue guildId={param.guildId}/>
            <Controller guildId={param.guildId}/>
            <Menu />
        </div>
    );
}

export default Main