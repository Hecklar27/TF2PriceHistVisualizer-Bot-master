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
            // forget hat name
            message.channel.send("Use c.unusual help for more info")
        } else if (args[0] == 'help') {
            message.channel.send("Usage: bp.unusual itemname(. between spaces) unusualeffect(. between spaces)")
            message.channel.send("Example: bp.unusual Engineer's.Cap Frostbite")
        } else {
            message.channel.send("Retrieving Data...")
            let name = args[0]
            // remove filler periods
            name = name.replace('.', ' ').replace('.', ' ').replace('.', ' ').replace('.', ' ').replace('.', ' ')
            var bpname = args[0]
            bpname = bpname.replace('.', '%20').replace('.', '%20').replace('.', '%20').replace('.', '%20').replace('.', '%20')
            let eff = args[1]
            // grabs icon of given hat
            let grabbed = iconGrab(name)
            let url = grabbed[0]
            let Class = grabbed[1]
            let icondef = classIcon(Class)
            if (url == undefined || url == 'error') {
                // triggers if the icon grab cannot find a url for the icon of the given hat
                message.channel.send("Check item name!")
            } else {
                if (eff == undefined) {
                    // triggers if the effect name is not in the local database
                    message.channel.send("Check Effect name!")
                } else {
                    eff = eff.replace('.', ' ').replace('.', ' ').replace('.', ' ').replace('.', ' ')
                    let effdata = Unusual.getEffectImages(eff)
                    if (effdata == null) {
                        // second check of the effect name (triggers if the effect exists in steams database but not the local database)
                        message.channel.send("Check Effect name!")
                    } else {
                        // triggers if hat and effect name are the same
                        var priceindex = effdata.id
                        var efficon = effdata.images.large
                        var id = message.author.id
                        axios.get(`https://backpack.tf/api/IGetPriceHistory/v1?appid=440&item=${bpname}&quality=Unusual&tradable=True&craftable=True&priceindex=${priceindex}&key=${tokenStr}`)
                            .then((res) => {
                                // asks the API for the selected unusuals pricing history
                                console.log(`https://backpack.tf/api/IGetPriceHistory/v1?appid=440&item=${bpname}&quality=Unusual&tradable=True&craftable=True&priceindex=${priceindex}&key=${tokenStr}`)
                                const hist = res.data.response.history
                                let currency = hist[hist.length - 1].currency
                                const times = [];
                                // converts the unix timestamps of each price suggestions acceptence date to formatted MM/DD/YYYY dates and pushes them to an array
                                for (i = 0; i< hist.length; i++) {
                                    let time = (hist[i].timestamp)*1000
                                    let dateObject = new Date(time)
                                    let acceptDate = dateObject.toLocaleString("en-US")
                                    acceptDate = acceptDate.split(',')[0]
                                    times.push(acceptDate)
                                }
                                const timediff = [];
                                // takes all the unix timestamps and puts them in an array
                                for (i = 0; i< hist.length; i++) {
                                    let time = (hist[i].timestamp)
                                    timediff.push(time)
                                }
                                // diff function determines the time between each unix timestamp in the previously created array
                                const timediff2 = diff(timediff)
                                const timediff3 = [];
                                // converts the unix timestamps into a difference of years months and days 
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
                                // creates an average value from the price range and makes a string of the price range as well
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
                                // finds the difference between the price changes
                                const pricechange = diff(averageprices)
                                console.log(pricechange)
                                const histdata = [];
                                // creates an array including some elements of the final image  
                                for (i = 1; i<hist.length+1; i++) {
                                    histdata[hist.length-i] = {
                                        // the price range
                                        price:prices[hist.length - i],
                                        // Date of acceptence
                                        date:times[hist.length - i],
                                        // page which it will show on the paginator
                                        page:(hist.length+1)-i,
                                        // Difference in price from the last suggestion
                                        pricedifference:pricechange[hist.length - i-1],
                                        // Length of time between the suggestions
                                        timedifference:timediff3[hist.length - i-1]
                                    }
                                }
                                console.log(histdata)
                                // renaming for simplicity
                                if (Class == 'all_class') {
                                    Class = 'Multi-Class'
                                }
                                // final data array with all the required information for canvas construction
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
                                // creates the final embed, see schemas/embedcreationSchema
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