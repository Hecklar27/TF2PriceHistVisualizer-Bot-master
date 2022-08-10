module.exports = {
    name: "ping",
    category: "dev",
    permissions: [],
    devOnly: true,
    run: async ({bot, message, args}) => {
        message.reply("Running")
    }
}