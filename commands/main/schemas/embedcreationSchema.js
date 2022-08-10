const {canvastemplateReport} = require('./canvastemplateSchema.js')
const {canvasReport} = require('./canvasreportSchema.js')

const { MessageEmbed } = require('discord.js')
const { Pagination } = require('discordjs-filepagination')

async function embedcreation(ultradata) {
    var message = ultradata.message
    var embeds = [];
    var pagess = [];
    var files = [];
    var color = "#8650AC"
    var quality = 'Unusual'
    var unusualid = ultradata.effectid
    var id = ultradata.id
    var bpname = ultradata.name.replace(' ','%20').replace(' ','%20').replace(' ','%20').replace(' ','%20').replace(' ','%20')
    // creates page array for the embed
    for (i = 0; i < ultradata.data.length; i++) {
        pagess.push(ultradata.data[i].page)
    }
    // creates a template canvas drawing of elements that stay constant (hat, effect, certian factors of the image, etc.) to save proccessing power. see schemas/canvastemplateSchema
    var bg = await canvastemplateReport(ultradata.icon, id, ultradata.class, ultradata.classicon, ultradata.name, ultradata.effectname, ultradata.effecticon)
    for (i = 0; i < ultradata.data.length; i++) {
        // creates the final fully completed report, one page at a time. see schemas/canvasreportSchema
        const fancyPrice = await canvasReport(bg, id, ultradata.data[i].price, ultradata.currency, ultradata.data[i].date, ultradata.data[i].pricedifference, ultradata.data[i].timedifference, ultradata.data[i].page)
        topush = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`Click here for the Backpack.tf stats page!`)
            .setURL(`https://backpack.tf/stats/${quality}/${bpname}/Tradable/Craftable/${unusualid}`)
            .setImage(`attachment://${fancyPrice.name}`)
            .setFooter({ text: `work in progress                    page:${[pagess[i]]}/${ultradata.data.length}`})

        embeds.push(topush)
        files.push(fancyPrice)
    }
    // finally sends the pagination
    await new Pagination(message.channel, embeds, files).paginate();   
}

module.exports.embedcreation = embedcreation;