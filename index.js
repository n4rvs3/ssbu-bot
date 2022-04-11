const { Client, Intents } = require('discord.js') // discord.js
const { token } = require('./config.json') // 同階層のconfig.jsonからトークンを取得

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, //サーバー関連全般
    Intents.FLAGS.GUILD_MESSAGES, // メッセージイベント全般
    Intents.FLAGS.GUILD_MEMBERS // メンバー関連全般
    ]
})

client.on('ready', () => {
    // 起動時に発火するイベント
    console.log('Ready Bot!')
})

// スラッシュコマンド関連
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    if (commandName === 'hello') {
        await interaction.reply('Hello World')
    }
})

// 新規メンバーが参加した際にロールを付与する処理
client.on('guildMemberAdd', member => {
    // add('ここに付与したいロールのIDを入れる')
    member.roles.add('639887322623770646')
})

client.login(token)