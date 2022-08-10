const Canvas = require('canvas')
const { registerFont } = require('canvas')
registerFont('./fonts/tf2build.ttf', { family: 'TF2 Build' })

const dim = {
    height: 520,
    width: 1350
}

/* setups a template with elements such as 
    - Hat Icon
    - Unusual Effect
    - Class Icons
    - Item Name
   and othe elements that do not change per page, speeding up the creation proccess of the embed very significantly
*/

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
    
    // creates the buffer and returns it so the final report can use it
    return background

}

module.exports.canvastemplateReport = canvastemplateReport;