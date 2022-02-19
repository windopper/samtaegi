import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import './Main.css'
import Queue from './Queue'
import Controller from './Controller'
import Menu from './Menu'
import Board from './Board'
import StatusBoard from './StatusBoard'
import Alert from './Alert'


function Main() {

    const param = useParams()

    return (
        <div className='container'>
            <Queue guildId={param.guildId}/>
            <Controller guildId={param.guildId} />
            <Menu guildId={param.guildId} personalId={param.personalId}/>
            <StatusBoard />
            <Alert />
        </div>
    );
}

export default Main