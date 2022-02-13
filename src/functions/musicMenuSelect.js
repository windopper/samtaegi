const music_player_commands = require('../commands/music_player_commands')

function menuSelect(interaction) {

    if(!interaction.isSelectMenu()) return
    if(interaction.component.customId != 'track select') return

    let guildId = interaction.guildId

    if(music_player_commands.Players.has(guildId)) {
        const player = music_player_commands.Players.get(guildId)
        player.addQueue(interaction.values[0], interaction)
    }
    else {
        music_player_commands.initializer(interaction)
        if(music_player_commands.Players.has(guildId)) {
            const player = music_player_commands.Players.get(guildId)
            player.addQueue(interaction.values[0], interaction)
        }
    }
}

module.exports = {
    menuSelect: menuSelect
}