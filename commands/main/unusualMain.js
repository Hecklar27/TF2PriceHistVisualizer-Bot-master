const Unusual = require('unusual-effects')
const axios = require('axios')

const {iconGrab} = require('./schemas/iconSchema.js')
const {classIcon} = require('./schemas/classIconSchema.js')

const {embedcreation} = require('./schemas/embedcreationSchema.js')

let tokenStr = process.env.BPTOKEN
require("dotenv").config()

function diff(ary) {
    var newA = [];
    for (var i = 1; i < ary.length; i++) newA.push(ary[i] - ary[i-1])
    return newA;
}

module.exports = {
    name: "unusual",
    category: "main",
    permissions: [],
    devOnly: false, 
    run: async ({bot, message, args}) => {
        var id = message.author.id
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
            let grabbed = iconGrab(name)
            let url = grabbed[0]
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
                                    message:message,
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