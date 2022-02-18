import { io } from 'socket.io-client'

export const defaultSocket = io('http://localhost:5000')
export function guildSocket(guildId) {
    return (
        io(`http://localhost:5000/${guildId}`)
    )
}