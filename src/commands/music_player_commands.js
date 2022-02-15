const { joinVoiceChannel } = require('@discordjs/voice')
const { IntegrationApplication } = require('discord.js')
const { MusicManager } = require('../functions/musicPlayer')
const { positive } = require('../messages/music_message')

const Players = new Map()

function listener(interaction, io) {

    let guildId = interaction.guildId
    let commandName = interaction.commandName

    if(Players.has(guildId)) {
        let player = Players.get(guildId)

        if(commandName === 'connect') {
            if(initializer(interaction)) {
                interaction.reply({
                    content: positive(`**${interaction.member.voice.channel.name} **에 연결되었습니다`)
                })
            }
        }
        else if(commandName === 'disconnect') {
             player.disconnect(interaction);
             Players.delete(guildId)
        }
        else if(commandName === 'stop') {
            player.stop(interaction);
        }
        else if(commandName === 'shuffle') {
            player.shuffle(interaction);
        }
        else if(commandName === 'pause') {
            player.pause(interaction);
        }
        else if(commandName === 'unpause') {
            player.unpause(interaction);
        }
        else if(commandName === 'list') {
            player.showQueue(interaction);
        }
        else if(commandName === 'skip') {
            player.skip(interaction);
        } 
        else if(commandName === 'repeat') {
            player.repeat(interaction, interaction.options.getString('options'))
        }
        else if(commandName === '삼태기') {
            player.addQueue('https://www.youtube.com/watch?v=zEYpydNwgDc', interaction)
        }
        else if(commandName === 'p') {
            player.addQueue(interaction.options.getString('urlorsearch'), interaction)
        }
    }
    else {
        if(commandName === 'connect') {
            if(initializer(interaction)) {
                interaction.reply({
                    content: positive(`**${interaction.member.voice.channel.name} **에 연결되었습니다`)
                })
            }
        }
        else if(commandName === 'disconnect') warningVoiceConnect(interaction)
        else if(commandName === 'stop') warningVoiceConnect(interaction)
        else if(commandName === 'shuffle') warningVoiceConnect(interaction)
        else if(commandName === 'pause') warningVoiceConnect(interaction)
        else if(commandName === 'unpause') warningVoiceConnect(interaction)
        else if(commandName === 'list') warningVoiceConnect(interaction)
        else if(commandName === 'skip') warningVoiceConnect(interaction)
        else if(commandName === 'repeat') warningVoiceConnect(interaction)
        else if(commandName === 'p') {
            initializer(interaction)
            if(Players.has(guildId)) {
                let player = Players.get(guildId)
                player.addQueue(interaction.options.getString('urlorsearch'), interaction)
            }
        }
        else if(commandName === '삼태기') {
            initializer(interaction)
            if(Players.has(guildId)) {
                let player = Players.get(guildId)
                player.addQueue('https://www.youtube.com/watch?v=zEYpydNwgDc', interaction)
            }
        }
    }

    emitter(io, guildId)
}

function emitter(io, guildId) {
    io.emit('voicechannelInfo', {
        size: Players.size,
    })
}

function initializer(interaction) {
    if(interaction.member.voice.channel) {
        let guildId = interaction.guildId
        Players.set(guildId, new MusicManager(
            joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })
        ))
        return true
    }
    else {
        interaction.reply({
            content: `:x: ${interaction.user.username}님이 음성채널에 없습니다`
        })
        return false
    }
}

function warningVoiceConnect(interaction) {
    interaction.reply({
        content: ":x: 음성채널에 연결되어 있지 않습니다",
    });
}

module.exports = {
    listener: listener,
    initializer: initializer,
    Players: Players
}