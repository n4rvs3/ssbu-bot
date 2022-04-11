const { Client, Intents } = require('discord.js') // discord.js
const { token } = require('./config.json') // 同階層のconfig.jsonからトークンを取得

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, //サーバー関連全般
    Intents.FLAGS.GUILD_MESSAGES, // メッセージイベント全般
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, // メンバー関連全般
    ]
})

client.on('ready', () => {
    // 起動時に発火するイベント
    console.log('Ready Bot!')
    /**
     * 事前にチャンネルを作成、リアクションを付けるメッセージを送信した場合
     * Botは起動前に送信されたメッセージをキャッシュすることが出来ない為、起動時のイベントで明示的にキャッシュを取得する必要がある
     * client.channels.cache.get('チャンネルのID').messages.fetch('メッセージのID')
     */
    client.channels.cache.get('962969188622811166').messages.fetch('962973654470246401')
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
    member.roles.add('962968751685373962')
})

// メッセージにリアクションが付与された時のイベント
client.on('messageReactionAdd', async (reaction, user) => {
    const message = reaction.message
    const member = message.guild.members.resolve(user)
    if (reaction.emoji.name === '👍') {
        member.roles.add('962970801110392904')
        member.roles.remove('962968751685373962')
    }
})

client.login(token)