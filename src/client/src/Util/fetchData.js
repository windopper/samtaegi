import { guildSocket, defaultSocket } from '../socket'

export function fetchData(guildId) {
    return new Promise((resolve, reject) => {
        defaultSocket.emit('requestData', guildId, (response) => {
            resolve(response)
        })
    })
}

export function fetchGuildIcon() {
    return new Promise((resolve, reject) => {
        defaultSocket.emit('REQUEST_GUILD_ICON', (response) => {
            resolve(response)
        })
    })
}