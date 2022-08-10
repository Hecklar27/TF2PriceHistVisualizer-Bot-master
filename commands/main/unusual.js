module.exports = {
    name: "unusual",
    category: "main",
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        message.channel.send("in progress")
    }
}