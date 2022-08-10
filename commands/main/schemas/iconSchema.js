
const fs = require('fs')

exports.iconGrab = (name) => {

    var url;
    var Class;
    var itemMain;
    var the = 'The '
    var itemObject;
    var model;

    let rawdata = fs.readFileSync('./api/items.json')
    itemMain = JSON.parse(rawdata)

    // function to find the hat name from the entire tf2 item
    function findWord(word, str) {
        return RegExp('\\b' + word + '\\b').test(str)
    }
                
    const index = itemMain.findIndex(object => {
        return object.name === name
    })
    // looks for a hat by name, then if it finds one takes some data into an array
    if (itemMain[index] != undefined) {
        itemObject = itemMain[index]
        // hat icon 
        url = itemObject.image_url_large
        // precursor for figuring out what class the hat is for
        model = itemObject.image_inventory
        if (findWord('all_class', model) == true) {
            Class = 'all_class'
        } else {
            Class = itemObject.used_by_classes[0]
        }
    } else {
        // Some hats have "the" infront of their name on backpack.tf and ingame, but not in the steam api for some reason. This is the workaround for this application
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

    // returns all the neccesary images and class data
    return IconData
}

