const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { BOT_TOKEN } = require('./config.json');


function deploy_commands() {

    // const data = new SlashCommandBuilder()
    // .setName("repeat")
    // .setDescription("삼태기 봇의 반복여부를 설정합니다")
    // .addStringOption((o) => {
    //   o.setName("options")
    //     .setDescription("반복 여부를 설정합니다")
    //     .setRequired(true)
    //     .addChoice("none", "none")
    //     .addChoice("song", "song")
    //     .addChoice("queue", "queue");
// })       

    const commands = [
        new SlashCommandBuilder()
        .setName('p')
        .setDescription('음악을 재생합니다')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('SoundCloudTrack | SoundCloudPlayList | YouTubeVideo')
                .setRequired(true)),
        new SlashCommandBuilder()
            .setName('connect')
            .setDescription('자신이 연결되어 있는 음성 채널에 들어옵니다'),
      new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("음성 채널에 연결되어 있다면 연결을 해제합니다"),
      new SlashCommandBuilder()
        .setName("stop")
        .setDescription("모든 큐를 제거하고 음악을 멈춥니다"),
      new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("큐를 섞습니다"),
      new SlashCommandBuilder()
        .setName("pause")
        .setDescription("음악을 일시정지 상태로 바꿉니다"),
      new SlashCommandBuilder()
        .setName("unpause")
        .setDescription("일시정지 상태의 음악을 재생합니다"),
      new SlashCommandBuilder()
        .setName("list")
        .setDescription("모든 큐를 보여줍니다"),
      new SlashCommandBuilder()
        .setName("삼태기")
        .setDescription("삼태기 메들리를 재생합니다"),
      new SlashCommandBuilder()
        .setName("skip")
        .setDescription("현재 음악을 스킵합니다"),
        new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('삼태기 봇의 음악 반복여부를 설정합니다')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('반복 여부를 설정합니다')
                .setRequired(true)
                .addChoice('none', 'none')
                .addChoice('song', 'song')
                .addChoice('queue', 'queue'))
,
    ].map((command) => command.toJSON());
    
    const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);
    
    let clientId = '939823628541915196'
    let guildId = '833265340468297738'
    
    // rest.get(Routes.applicationGuildCommands(clientId, guildId))
    // .then(data => {
    //     const promises = [];
    //     for (const command of data) {
    //         const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
    //         promises.push(rest.delete(deleteUrl));
    //     }
    //     return Promise.all(promises);
    // });

        rest.get(Routes.applicationCommands(clientId))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });

    // rest.put(Routes.applicationCommands(clientId), { body: commands })
    //     .then(() => console.log('Successfully registered application commands.'))
    //     .catch(console.error);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
        .then(()=> console.log('Successfully registered application commands.'))
        .catch(console.error)
}

module.exports = {
    deploy_commands: deploy_commands
}

