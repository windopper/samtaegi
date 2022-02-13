const music_player_commands = require('../commands/music_player_commands')
const playdl = require('play-dl')
const alert = require('../messages/music_message')

function menuSelect(interaction) {

    if(!interaction.isSelectMenu()) return
    if(interaction.component.customId != 'track select') return
    
    let guildId = interaction.guildId

    if(music_player_commands.Players.has(guildId)) {
        const player = music_player_commands.Players.get(guildId)
        addMusicToQueue(interaction.values[0], interaction, player)
    }
    else {
        music_player_commands.initializer(interaction)
        if(music_player_commands.Players.has(guildId)) {
            const player = music_player_commands.Players.get(guildId)
            addMusicToQueue(interaction.values[0], interaction, player)
        }
    }
}

async function addMusicToQueue(url, interaction, player) {

    interaction.deferUpdate()

    let title
    let duration

    await playdl.video_basic_info(url).then((e)=> {
        title = e.video_details.title
        duration = e.video_details.durationInSec
    })

    const queue = {
        url: url,
        title: title,
        duration: duration,
    }
    player.queue.push(queue)
    if(player.queue.length==1) player.play(url)
    
    interaction.editReply({
        content: alert.positive('**'+queue.title+"** 이(가) 성공적으로 큐에 등록되었습니다"),
        components: []
    })
}

module.exports = {
    menuSelect: menuSelect
}