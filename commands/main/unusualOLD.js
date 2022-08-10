const Unusual = require('unusual-effects')
const axios = require('axios')
const {iconGrabv3} = require('./schemas/iconSchema3.js')
const Discord = require("discord.js")
const { MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const { MessageEmbed } = require('discord.js')
const { Pagination } = require('discordjs-filepagination')
//const { Pagination } = require('discordjs-button-embed-pagination')
const { registerFont } = require('canvas')
registerFont('./fonts/tf2build.ttf', { family: 'TF2 Build' })

let tokenStr = process.env.BPTOKEN
require("dotenv").config()

var down = 'https://i.imgur.com/eUTKWqT.png'
var up = 'https://i.imgur.com/9LPaRD0.png'
var refresh = 'https://i.imgur.com/L6BRkee.png'
var start = 'https://i.imgur.com/i8ALrz2.png'


function diff(ary) {
    var newA = [];
    for (var i = 1; i < ary.length; i++) newA.push(ary[i] - ary[i-1])
    return newA;
}

function classIcon(classname) {
    if (classname == 'all_class') {
        return 'https://i.imgur.com/QSD2bqM.png'
    }
    if (classname == 'Scout') {
        return 'https://wiki.teamfortress.com/w/images/1/16/Scout_emblem_BLU.png'
    }
    if (classname == 'Soldier') {
        return 'https://wiki.teamfortress.com/w/images/a/a9/Soldier_emblem_BLU.png'
    }
    if (classname == 'Pyro') {
        return 'https://wiki.teamfortress.com/w/images/5/5c/Pyro_emblem_BLU.png'
    }
    if (classname == 'Demoman') {
        return 'https://wiki.teamfortress.com/w/images/1/1e/Demoman_emblem_BLU.png'
    }
    if (classname == 'Heavy') {
        return 'https://wiki.teamfortress.com/w/images/b/b5/Heavy_emblem_BLU.png'
    }
    if (classname == 'Engineer') {
        return 'https://wiki.teamfortress.com/w/images/1/1c/Engineer_emblem_BLU.png'
    }
    if (classname == 'Medic') {
        return 'https://wiki.teamfortress.com/w/images/c/c7/Medic_emblem_BLU.png'
    }
    if (classname == 'Sniper') {
        return 'https://wiki.teamfortress.com/w/images/c/c6/Sniper_emblem_BLU.png'
    }
    if (classname == 'Spy') {
        return 'https://wiki.teamfortress.com/w/images/5/51/Spy_emblem_BLU.png'
    }

        
}

const dim = {
    height: 520,
    width: 1350
}

async function canvastemplateReport(item, id, Class, classicon, name, effectname, effecticon) {
    const canvasstuff = {
        item:item,
        id:id,
        Class:Class,
        classicon:classicon,
        name:name,
        effectname:effectname,
        effecticon:effecticon,
    }
    console.log(canvasstuff)
    const canvas = Canvas.createCanvas(dim.width, dim.height)
    const ctx = canvas.getContext("2d")
    const bg = await Canvas.loadImage('https://i.imgur.com/ljRvFqR.png')
    ctx.drawImage(bg, 0, 0)
    const icon = await Canvas.loadImage(item)
    const cicon = await Canvas.loadImage(classicon)
    const efficon = await Canvas.loadImage(effecticon)
    ctx.font = '40px "TF2 Build"'
    var itemstring = name
    var effectstring = effectname
    effectstring = effectstring.replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ')
    itemstring = itemstring.replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ').replace('.',' ')
    let effecttextWidth = ctx.measureText(effectstring).width;
    let itemtextWidth = ctx.measureText(itemstring).width;
    ctx.globalAlpha = 1
    ctx.fillStyle = "#8650AC"
    ctx.fillRect(175, 35, 375, 375)
    ctx.fillText(itemstring, ((dim.width/2) - (itemtextWidth/2))-310, 480)
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(185, 45, 355, 355)
    ctx.drawImage(efficon, 180, 50, 350, 350)
    ctx.drawImage(icon, 180, 50, 350, 350)
    ctx.fillStyle = '#000000'
    ctx.fillText('EFFECT:', 600, 310)
    ctx.fillText('CLASS:', 600, 360)
    ctx.fillText('DATE UPDATED:', 600, 410)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(Class, 750, 360)
    ctx.font = '50px "TF2 Build"'
    ctx.drawImage(cicon, 450, 50, 75, 75)
    ctx.font = '40px "TF2 Build"'
    if (effecttextWidth > 500) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '28px "TF2 Build"'
        ctx.fillText(effectname, 770, 305)
    } else {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '40px "TF2 Build"'
        ctx.fillText(effectname, 770, 310)
    }

    ctx.restore()
    
    const background = canvas.toBuffer()
    
    return background

}

async function canvasReport(background, id, nprice, currency, date, pricedifference, timedifference, page) {
    const canvasstuff = {
        id:id,
        nprice:nprice,
        currency:currency,
        date:date,
        pricedifference:pricedifference,
        timedifference:timedifference
    }
    console.log(canvasstuff)
    const canvas = Canvas.createCanvas(dim.width, dim.height)
    const ctx = canvas.getContext("2d")
    const bg = await Canvas.loadImage(background)
    ctx.drawImage(bg, 0, 0)
    const upp = await Canvas.loadImage(up)
    const downn = await Canvas.loadImage(down)
    const refreshh = await Canvas.loadImage(refresh)
    const startt = await Canvas.loadImage(start)
    ctx.font = '40px "TF2 Build"'
    ctx.globalAlpha = 1
    ctx.fillStyle = '#000000'
    let fullprice = `${nprice} ${currency}`
    let fullpriceWidth = ctx.measureText(fullprice).width;
    let pricedifferenceWidth = ctx.measureText(pricedifference).width;
    if (fullpriceWidth > 210) {
        ctx.fillText('PRICE:', 600, 100)
    } else {
        ctx.fillText('PRICE:', 600, 180)
    }
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(date, 930, 410)
    ctx.font = '50px "TF2 Build"'
    ctx.fillText(fullprice, ((dim.width/2) - (fullpriceWidth/2))+180, 180)
    ctx.font = '40px "TF2 Build"'
    if (pricedifference == undefined) {
        ctx.drawImage(startt, 1175, 130, 125, 125)
        ctx.fillStyle = '#F09A3F'
        ctx.fillText('FIRST PRICE!', 750, 240)
    } else if (pricedifference == 0) {
        ctx.drawImage(refreshh, 1175, 130, 125, 125)
    } else if (pricedifference > 0) {
        ctx.drawImage(upp, 1175, 130, 125, 125)
        ctx.fillStyle = '#628C2A'
        ctx.fillText(`+${pricedifference} ${currency}`, ((dim.width/2) - (pricedifferenceWidth/2))+150, 240)
    } else {
        ctx.drawImage(downn, 1175, 130, 125, 125)
        ctx.fillStyle = '#C84B43'
        ctx.fillText(`${pricedifference} ${currency}`, ((dim.width/2) - (pricedifferenceWidth/2))+150, 240)
    }
    ctx.font = '40px "TF2 Build"'
    ctx.fillStyle = '#FFFFFF'
    if (timedifference != undefined) {
        if (timedifference.years > 0) {
            if (timedifference.months > 0) {
                if (timedifference.days > 0) {
                    // years months days
                    ctx.fillText(`${timedifference.years} years`, 1150, 370)
                    ctx.fillText(`${timedifference.months} months`, 1150, 410)
                    ctx.fillText(`${timedifference.days} days`, 1150, 450)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since last update', 1150, 480)
                } else {
                    // years months
                    ctx.fillText(`${timedifference.years} years`, 1150, 370)
                    ctx.fillText(`${timedifference.months} months`, 1150, 410)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since last update', 1150, 440)
                }
            } else  {
                if (timedifference.days > 0) {
                    // years days
                    ctx.fillText(`${timedifference.years} years`, 1150, 370)
                    ctx.fillText(`${timedifference.days} days`, 1150, 410)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since last update', 1150, 440)
                }
            }
            if (timedifference.months == 0 && timedifference == 0) {
                // years
                ctx.fillText(`${timedifference.years} years`, 1150, 370)
                ctx.font = '20px "TF2 Build"'
                ctx.fillText('since last update', 1150, 400)
            }
        } else {
            if (timedifference.months > 0) {
                if (timedifference.days > 0) {
                    // months days
                    ctx.fillText(`${timedifference.months} months`, 1150, 370)
                    ctx.fillText(`${timedifference.days} days`, 1150, 410)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since last update', 1150, 440)
                } else {
                    // months 
                    ctx.fillText(`${timedifference.months} months`, 1150, 370)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since last update', 1150, 400)
                }
            } else {
                // days
                ctx.fillText(`${timedifference.days} days`, 1150, 370)
                ctx.font = '20px "TF2 Build"'
                ctx.fillText('since last update', 1150, 400)
            }  
        }
    }
    ctx.restore()
    
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${page}pricerequest${id}.png`)
    
    return attachment

}

module.exports = {
    name: "utest4",
    category: "info",
    permissions: [],
    devOnly: false, 
    run: async ({bot, message, args}) => {
        var id = message.author.id
        async function embedcreation(ultradata) {
            var embeds = [];
            var pagess = [];
            var files = [];
            var color = "#8650AC"
            var quality = 'Unusual'
            var unusualid = ultradata.effectid
            var bpname = ultradata.name.replace(' ','%20').replace(' ','%20').replace(' ','%20').replace(' ','%20').replace(' ','%20')
            for (i = 0; i < ultradata.data.length; i++) {
                pagess.push(ultradata.data[i].page)
            }
            var bg = await canvastemplateReport(ultradata.icon, id, ultradata.class, ultradata.classicon, ultradata.name, ultradata.effectname, ultradata.effecticon)
            for (i = 0; i < ultradata.data.length; i++) {
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
            //console.log(embeds)
            //console.log(files)
            await new Pagination(message.channel, embeds, files).paginate();   
        }
        
        if (!args[0]) {
            message.channel.send("Use c.unusual help for more info")
        } else if (args[0] == 'help') {
            message.channel.send("Usage: c.unusual itemname(. between spaces) unusualeffect(. between spaces)")
            message.channel.send("Example: c.unusual Engineer's.Cap Frostbite")
        } else {
            message.channel.send("Retrieving Data...")
            let name = args[0]
            name = name.replace('.', ' ').replace('.', ' ').replace('.', ' ').replace('.', ' ').replace('.', ' ')
            var bpname = args[0]
            bpname = bpname.replace('.', '%20').replace('.', '%20').replace('.', '%20').replace('.', '%20').replace('.', '%20')
            let eff = args[1]
            let grabbed = iconGrabv3(name)
            let url = grabbed[0]
            // console.log(url)
            let Class = grabbed[1]
            let icondef = classIcon(Class)
            if (url == undefined || url == 'error') {
                message.channel.send("Check item name!")
            } else {
                if (eff == undefined) {
                    message.channel.send("Check Effect name!")
                } else {
                    eff = eff.replace('.', ' ').replace('.', ' ').replace('.', ' ').replace('.', ' ')
                    let effdata = Unusual.getEffectImages(eff)
                    if (effdata == null) {
                        message.channel.send("Check Effect name!")
                    } else {
                        var priceindex = effdata.id
                        var efficon = effdata.images.large
                        var id = message.author.id
                        axios.get(`https://backpack.tf/api/IGetPriceHistory/v1?appid=440&item=${bpname}&quality=Unusual&tradable=True&craftable=True&priceindex=${priceindex}&key=${tokenStr}`)
                            .then((res) => {
                                console.log(`https://backpack.tf/api/IGetPriceHistory/v1?appid=440&item=${bpname}&quality=Unusual&tradable=True&craftable=True&priceindex=${priceindex}&key=${tokenStr}`)
                                const hist = res.data.response.history
                                let currency = hist[hist.length - 1].currency
                                const times = [];
                                for (i = 0; i< hist.length; i++) {
                                    let time = (hist[i].timestamp)*1000
                                    let dateObject = new Date(time)
                                    let acceptDate = dateObject.toLocaleString("en-US")
                                    acceptDate = acceptDate.split(',')[0]
                                    times.push(acceptDate)
                                }
                                const timediff = [];
                                for (i = 0; i< hist.length; i++) {
                                    let time = (hist[i].timestamp)
                                    timediff.push(time)
                                }
                                const timediff2 = diff(timediff)
                                const timediff3 = [];
                                for (i = 0; i< timediff2.length; i++) {
                                    var numyears = Math.floor(timediff2[i] / 31536000);
                                    var nummonths = Math.floor((timediff2[i] % 31536000) / 2628000);
                                    var numdays = Math.floor(((timediff2[i] % 31536000) % 2628000) / 86400);
                                    timediff3[i] = {
                                        years:numyears,
                                        months:nummonths,
                                        days:numdays
                                    }
                                }
                                console.log(timediff3)
                                const prices = [];
                                const averageprices = [];
                                for (i = 0; i<hist.length; i++) {
                                    let value;
                                    let valuelow = Math.round(hist[i].value)
                                    let valuehigh = Math.round(hist[i].value_high)
                                    if (valuelow == valuehigh) {
                                        value = valuelow
                                    } else {
                                        value = `${valuelow} - ${valuehigh}`
                                    }
                                    let averagevalue = (valuelow+valuehigh)/2
                                    prices.push(value)
                                    averageprices.push(averagevalue)
                                }

                                const pricechange = diff(averageprices)
                                console.log(pricechange)
                                const histdata = [];
                                for (i = 1; i<hist.length+1; i++) {
                                    histdata[hist.length-i] = {
                                        price:prices[hist.length - i],
                                        date:times[hist.length - i],
                                        page:(hist.length+1)-i,
                                        pricedifference:pricechange[hist.length - i-1],
                                        timedifference:timediff3[hist.length - i-1]
                                    }
                                }
                                console.log(histdata)
                                if (Class == 'all_class') {
                                    Class = 'Multi-Class'
                                }
                                var ultradata = {
                                    icon:url,
                                    id:id,
                                    data:histdata,
                                    class:Class,
                                    classicon:icondef,
                                    currency:currency,
                                    name:name,
                                    effectid:priceindex,
                                    effectname:eff,
                                    effecticon:efficon,
                                }
                                return ultradata
                                
                                })
                                .then(embedcreation)
                                .catch((err) => {
                                    message.channel.send("Request Error")
                                    console.error('ERR', err) 
                                    console.log(`https://backpack.tf/api/IGetPriceHistory/v1?appid=440&item=${bpname}&quality=Unusual&tradable=True&craftable=True&priceindex=${priceindex}&key=${tokenStr}`)
                                })
                    }
                }
            }
            
        }
    }
}