const { Client, Intents } = require('discord.js') // discord.js
const { token } = require('./config.json') // 同階層のconfig.jsonからトークンを取得

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, //サーバー関連全般
    Intents.FLAGS.GUILD_MESSAGES, // メッセージイベント全般
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, // メンバー関連全般
    ]
})

// 役職関連の変数とかいろいろ

// 新規メンバーに付与される役職のID(新人役職A)
const newMember_A = '962968751685373962'
// リアクションを押した時に付与される役職のID(新人役職B)
const newMember_B = '962970801110392904'
// たいぼの仕方を確認した後に付与される役職のID(新人役職C)
const newMember_C = '980758955850616884'
// たいぼ時にメンションする役職のID(&の後ろを適時置き換え)
const mention_role = '<@&639889334706765864>'
// 最初にリアクションを押すメッセージのID
const react_message = '962973654470246401'
// 段位設定するチャンネルのID
const rank_channel = '980758884899778570'
// 段位設定するメッセージのID
const rank_message = '980761880211648543'

const sample_role = '639889172751974400'




// readyイベント関連の配列
const readyArr = {
    // 新人Aの時に表示されるリアクション用のメッセージを配置しているチャンネルのID
    channel: '962969188622811166',
    // 上記のメッセージのID
    message: '962973654470246401',
    // 新人Cの時に段位を設定するメッセージが配置されているチャンネルのID
}

// 役職関連ここまで

client.on('ready', () => {
    // 起動時に発火するイベント
    console.log('Ready Bot!')
    /**
     * 事前にチャンネルを作成、リアクションを付けるメッセージを送信した場合
     * Botは起動前に送信されたメッセージをキャッシュすることが出来ない為、起動時のイベントで明示的にキャッシュを取得する必要がある
     * client.channels.cache.get('チャンネルのID').messages.fetch('メッセージのID')
     */
    client.channels.cache.get(readyArr.channel).messages.fetch(readyArr.message)
    client.channels.cache.get(rank_channel).messages.fetch(rank_message)
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
    member.roles.add(newMember_A)
})

// メッセージにリアクションが付与された時のイベント
client.on('messageReactionAdd', async (reaction, user) => {
    const message = reaction.message
    const member = message.guild.members.resolve(user)
    if (reaction.message.id == react_message) {
        if (reaction.emoji.name === '👍') {
            reaction.remove()
            member.roles.add(newMember_B)
            member.roles.remove(newMember_A)
        }
        return
    }
    else if (reaction.message.id == rank_message) {
        reaction.remove()
        member.roles.add(sample_role)
        member.roles.remove(newMember_C)
    }
})

// 実際のたいぼメッセージに対しての反応
client.on('messageCreate', message => {
    if (message.author.bot) {
        return
    }
    if (message.content.match(/募集/)) {
        // たいぼした人に新人Bの役職が付与されていた場合の処理
        if (message.member.roles.cache.has(newMember_B)) {
            message.reply('上手にできました！')
            message.member.roles.add(newMember_C)
            message.member.roles.remove(newMember_B)
            return
        }
        message.reply(`遊んでほしいって！${mention_role}さんおいでおいで！`);
        return;
    }
})

client.login(token)