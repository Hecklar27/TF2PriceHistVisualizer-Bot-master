
const fs = require('fs')
const Discord = require("discord.js")

exports.iconGrab = (name) => {

    var url;
    var Class;
    var itemMain;
    var the = 'The '
    var itemObject;
    var model;

    let rawdata = fs.readFileSync('./api/items.json')
    itemMain = JSON.parse(rawdata)

    function findWord(word, str) {
        return RegExp('\\b' + word + '\\b').test(str)
    }
                
    const index = itemMain.findIndex(object => {
        return object.name === name
    })
    if (itemMain[index] != undefined) {
        itemObject = itemMain[index]
        url = itemObject.image_url_large
        model = itemObject.image_inventory
        if (findWord('all_class', model) == true) {
            Class = 'all_class'
        } else {
            Class = itemObject.used_by_classes[0]
        }
    } else {
        var thename = the + name 
        const index = itemMain.findIndex(object => {
            return object.name === thename
        })
        if (itemMain[index] == undefined) {
            url = 'error'
        } else {
            itemObject = itemMain[index]
            url = itemObject.image_url_large
            model = itemObject.image_inventory
            if (findWord('all_class', model) == true) {
                Class = 'all_class'
            } else {
                Class = itemObject.used_by_classes[0]
            }
        }
                    
    }

    let IconData = [
        url,
        Class
    ]

    // console.log(IconData)

    return IconData
}

