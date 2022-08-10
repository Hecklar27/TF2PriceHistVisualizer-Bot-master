const Canvas = require('canvas')
const { registerFont } = require('canvas')
const Discord = require("discord.js")
registerFont('./fonts/tf2build.ttf', { family: 'TF2 Build' })

const dim = {
    height: 520,
    width: 1350
}

// creates the final image

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
    const upp = await Canvas.loadImage('https://i.imgur.com/9LPaRD0.png')
    const downn = await Canvas.loadImage('https://i.imgur.com/eUTKWqT.png')
    const refreshh = await Canvas.loadImage('https://i.imgur.com/L6BRkee.png')
    const startt = await Canvas.loadImage('https://i.imgur.com/i8ALrz2.png')
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
    // determines which icon and font color is used depending on how the price changed
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
    // annoying chain to correctly space the time differences by years, months, days, years and months, years and days, months and days, years and days, years months and days
    if (timedifference != undefined) {
        if (timedifference.years > 0) {
            if (timedifference.months > 0) {
                if (timedifference.days > 0) {
                    // years months days
                    ctx.fillText(`${timedifference.years} years`, 1150, 370)
                    ctx.fillText(`${timedifference.months} months`, 1150, 410)
                    ctx.fillText(`${timedifference.days} days`, 1150, 450)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since previous update', 1150, 480)
                } else {
                    // years months
                    ctx.fillText(`${timedifference.years} years`, 1150, 370)
                    ctx.fillText(`${timedifference.months} months`, 1150, 410)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since previous update', 1150, 440)
                }
            } else  {
                if (timedifference.days > 0) {
                    // years days
                    ctx.fillText(`${timedifference.years} years`, 1150, 370)
                    ctx.fillText(`${timedifference.days} days`, 1150, 410)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since previous update', 1150, 440)
                }
            }
            if (timedifference.months == 0 && timedifference == 0) {
                // years
                ctx.fillText(`${timedifference.years} years`, 1150, 370)
                ctx.font = '20px "TF2 Build"'
                ctx.fillText('since previous update', 1150, 400)
            }
        } else {
            if (timedifference.months > 0) {
                if (timedifference.days > 0) {
                    // months days
                    ctx.fillText(`${timedifference.months} months`, 1150, 370)
                    ctx.fillText(`${timedifference.days} days`, 1150, 410)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since previous update', 1150, 440)
                } else {
                    // months 
                    ctx.fillText(`${timedifference.months} months`, 1150, 370)
                    ctx.font = '20px "TF2 Build"'
                    ctx.fillText('since previous update', 1150, 400)
                }
            } else {
                // days
                ctx.fillText(`${timedifference.days} days`, 1150, 370)
                ctx.font = '20px "TF2 Build"'
                ctx.fillText('since previous update', 1150, 400)
            }  
        }
    }
    ctx.restore()
    
    // sends out a MessageAttachment buffer including the id of the user that created it and the page number to keep any issues from occuring
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${page}pricerequest${id}.png`)
    
    return attachment

}

module.exports.canvasReport = canvasReport;