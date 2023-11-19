//Nodegames by willmil11 [API]
//

module.exports = {
    "system": {
        "inited": false,
        "checkinit": function () {
            if (this.inited === false) {
                throw "[Nodegames] Nodegames is not initialised."
            }
        }
    },
    "init": function () {
        if (this.system.inited === true) {
            throw "[Nodegames] Nodegames is already initialised."
        }
        var execSync = require("child_process").execSync;

        try {
            // First run: npm ls -g
            var output = execSync(/^win/.test(process.platform) ? 'npm.cmd' : 'npm ls -g').toString();

            // If output doesn't contain "electron"
            if (!output.includes("electron")) {
                console.log("[Nodegames] Electron not found, installing...");

                // Install electron
                // npm install -g electron
                // Till close, do nothing
                execSync(/^win/.test(process.platform) ? 'npm.cmd' : 'npm install -g electron@27.0.4');
                console.log("[Nodegames] Electron installed.");
            }
        }
        catch (error) {
            throw "[Nodegames] Unable to install vital dependency (Electron 27.0.4)"
        }

        var easynodes;
        try {
            easynodes = require("easynodes");
        }
        catch (error) {
            try {
                try {
                    var output = execSync("npm root -g");
                }
                catch (error) {
                    throw "[Nodegames] Unable to install vital dependency (easynodes 1.0.1)"
                }
                output = output.toString().slice(0, output.toString().length - 1) + "/easynodes/"
                try {
                    easynodes = require(output);
                }
                catch (error) {
                    throw "[Nodegames] Unable to install vital dependency (easynodes 1.0.1)"
                }
            }
            catch (error) {
                try {
                    console.log("[Nodegames] easynodes not found, installing...");
                    execSync(/^win/.test(process.platform) ? 'npm.cmd' : 'npm install -g easynodes@1.0.1');
                    console.log("[Nodegames] easynodes installed.");
                    try {
                        var output = execSync("npm root -g");
                    }
                    catch (error) {
                        throw "[Nodegames] Unable to install vital dependency (easynodes 1.0.1)"
                    }
                    output = output.toString().slice(0, output.toString().length - 1) + "/easynodes/"
                    try {
                        easynodes = require(output);
                    }
                    catch (error) {
                        throw "[Nodegames] Unable to install vital dependency (easynodes 1.0.1)"
                    }
                }
                catch (error) {
                    throw "[Nodegames] Unable to install vital dependency (easynodes 1.0.1)"
                }
            }
        }
        this.system.easynodes = easynodes;
        this.system.easynodes.init();

        //"port-get@1.0.0"
        var portgetter;
        try {
            portgetter = require("port-get");
        }
        catch (error) {
            try {
                try {
                    var output = execSync("npm root -g");
                }
                catch (error) {
                    throw "[Nodegames] Unable to install vital dependency (port-get 1.0.0)"
                }
                output = output.toString().slice(0, output.toString().length - 1) + "/port-get/"
                try {
                    portgetter = require(output);
                }
                catch (error) {
                    throw "[Nodegames] Unable to install vital dependency (port-get 1.0.0)"
                }
            }
            catch (error) {
                try {
                    console.log("[Nodegames] port-get not found, installing...");
                    execSync(/^win/.test(process.platform) ? 'npm.cmd' : 'npm install -g port-get@1.0.0');
                    console.log("[Nodegames] port-get installed.");
                    try {
                        var output = execSync("npm root -g");
                    }
                    catch (error) {
                        throw "[Nodegames] Unable to install vital dependency (port-get 1.0.0)"
                    }
                    output = output.toString().slice(0, output.toString().length - 1) + "/port-get/"
                    try {
                        portgetter = require(output);
                    }
                    catch (error) {
                        throw "[Nodegames] Unable to install vital dependency (port-get 1.0.0)"
                    }
                }
                catch (error) {
                    throw "[Nodegames] Unable to install vital dependency (port-get 1.0.0)"
                }
            }
        }
        this.system.portget = portgetter;
        this.system.inited = true;
    },
    "newGame": function (callback, width, height) {
        this.system.checkinit();
        var execSync = require("child_process").execSync;
        var easynodes = this.system.easynodes;
        var portget = this.system.portget;
        var callbacks = {
            "sizeUpdate": function(){},
            "close": function(){},
            "mouseposupdate": function(){},
            "keypress": function(){},
            "mouseclick": function(){},
            "mousescroll": function(){},
            "keyrelease": function(){},
            "imageloaded": function(){},
            "error": function(){},
            "imageunloaded": function(){}
        }
        var loadedImages = [];
        var errorloadingImage = [];
        var errordrawingImage =  [];

        var port;
        portget().then(function (out) {
            port = parseInt(out);
            //"port" variable now contains a free port

            var clients = 0;
            var canvas = null;
            easynodes.websocket.newServer(port, async function (client) {
                clients += 1;
                if (clients === 3) {
                    client.close();
                    clients -= 1;
                    return;
                }
                var gameclosed = false;
                if (clients === 1) {
                    if (canvas === null) {
                        var checkclosed = function () {
                            if (gameclosed) {
                                throw "[Nodegames] Game is closed, cannot send instructions."
                            }
                        }
                        canvas = {
                            "get": {
                                "setPixel": function (x, y, rgb) {
                                    return (JSON.stringify({
                                        "type": "setPixel",
                                        "data": {
                                            "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                            "x": x,
                                            "y": y
                                        }
                                    }))
                                },
                                "clear": function () {
                                    return (JSON.stringify({
                                        "type": "clear"
                                    }))
                                },
                                "setRectangle": function (x, y, width, height, rgb, outline, rotation) {
                                    if (outline == null) {
                                        outline = false;
                                    }
                                    if (rotation == null) {
                                        rotation = 0;
                                    }
                                    return (JSON.stringify({
                                        "type": "setRectangle",
                                        "data": {
                                            "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                            "x": x,
                                            "y": y,
                                            "width": width,
                                            "height": height,
                                            "outline": outline,
                                            "rotation": rotation
                                        }
                                    }))
                                },
                                "setCircle": function (x, y, radius, rgb, outline) {
                                    if (outline == null) {
                                        outline = false;
                                    }
                                    return (JSON.stringify({
                                        "type": "setCircle",
                                        "data": {
                                            "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                            "x": x,
                                            "y": y,
                                            "radius": radius,
                                            "outline": outline,
                                            "rotation": 0
                                        }
                                    }))
                                },
                                "setLine": function (x1, y1, x2, y2, rgb, rotation) {
                                    if (rotation == null) {
                                        rotation = 0;
                                    }
                                    return (JSON.stringify({
                                        "type": "setLine",
                                        "data": {
                                            "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                            "x1": x1,
                                            "y1": y1,
                                            "x2": x2,
                                            "y2": y2,
                                            "rotation": rotation
                                        }
                                    }))
                                },
                                "setText": function (x, y, text, rgb, fontSize, fontName, rotation) {
                                    if (rotation == null) {
                                        rotation = 0;
                                    }
                                    return (JSON.stringify({
                                        "type": "setText",
                                        "data": {
                                            "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                            "x": x,
                                            "y": y,
                                            "text": text,
                                            "fontSize": fontSize,
                                            "fontName": fontName,
                                            "rotation": rotation
                                        }
                                    }))
                                },
                                "rawctx": function (rawctx) {
                                    return (JSON.stringify({
                                        "type": "rawctx",
                                        "data": {
                                            "rawctx": rawctx
                                        }
                                    }))
                                },
                                "clearZone": function (x, y, width, height) {
                                    return (JSON.stringify({
                                        "type": "clearZone",
                                        "data": {
                                            "x": x,
                                            "y": y,
                                            "width": width,
                                            "height": height
                                        }
                                    }))
                                },
                                "setPixelArray": function (pixelArray) {
                                    var index = 0;
                                    while (index < pixelArray.length) {
                                        var item = pixelArray[index];
                                        item[0] = "rgb(" + item[0][0] + ", " + item[0][1] + ", " + item[0][2] + ")";
                                        index += 1;
                                    }
                                    return (JSON.stringify({
                                        "type": "setPixelArray",
                                        "data": {
                                            "pixelArray": pixelArray
                                        }
                                    }))
                                },
                                "close": function(){
                                    return (JSON.stringify({
                                        "type": "action",
                                        "data": {
                                            "action": "close"
                                        }
                                    }))
                                },
                                "setImage": function(id, x, y, width, height, rotation){
                                    return (JSON.stringify({
                                        "type": "setImage",
                                        "data": {
                                            "id": id,
                                            "x": x,
                                            "y": y,
                                            "rotation": rotation,
                                            "width": width,
                                            "height": height
                                        }
                                    }))
                                }
                            },
                            "setPixel": function (x, y, rgb) {
                                checkclosed();
                                client.send(JSON.stringify({
                                    "type": "setPixel",
                                    "data": {
                                        "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                        "x": x,
                                        "y": y
                                    }
                                }))
                            },
                            "clear": function () {
                                checkclosed();
                                client.send(JSON.stringify({
                                    "type": "clear"
                                }))
                            },
                            "setRectangle": function (x, y, width, height, rgb, outline, rotation) {
                                checkclosed();
                                if (outline == null) {
                                    outline = false;
                                }
                                if (rotation == null) {
                                    rotation = 0;
                                }
                                client.send(JSON.stringify({
                                    "type": "setRectangle",
                                    "data": {
                                        "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                        "x": x,
                                        "y": y,
                                        "width": width,
                                        "height": height,
                                        "outline": outline,
                                        "rotation": rotation
                                    }
                                }))
                            },
                            "setCircle": function (x, y, radius, rgb, outline) {
                                checkclosed();
                                if (outline == null) {
                                    outline = false;
                                }
                                client.send(JSON.stringify({
                                    "type": "setCircle",
                                    "data": {
                                        "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                        "x": x,
                                        "y": y,
                                        "radius": radius,
                                        "outline": outline,
                                        "rotation": 0
                                    }
                                }))
                            },
                            "setLine": function (x1, y1, x2, y2, rgb, rotation) {
                                checkclosed();
                                if (rotation == null) {
                                    rotation = 0;
                                }
                                client.send(JSON.stringify({
                                    "type": "setLine",
                                    "data": {
                                        "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                        "x1": x1,
                                        "y1": y1,
                                        "x2": x2,
                                        "y2": y2,
                                        "rotation": rotation
                                    }
                                }))
                            },
                            "setText": function (x, y, text, rgb, fontSize, fontName, rotation) {
                                checkclosed();
                                if (rotation == null) {
                                    rotation = 0;
                                }
                                client.send(JSON.stringify({
                                    "type": "setText",
                                    "data": {
                                        "rgb": "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")",
                                        "x": x,
                                        "y": y,
                                        "text": text,
                                        "fontSize": fontSize,
                                        "fontName": fontName,
                                        "rotation": rotation
                                    }
                                }))
                            },
                            "rawctx": function (rawctx) {
                                checkclosed();
                                client.send(JSON.stringify({
                                    "type": "rawctx",
                                    "data": {
                                        "rawctx": rawctx
                                    }
                                }))
                            },
                            "clearZone": function (x, y, width, height, rotation) {
                                checkclosed();
                                if (rotation == null){
                                    rotation = 0;
                                }
                                client.send(JSON.stringify({
                                    "type": "clearZone",
                                    "data": {
                                        "x": x,
                                        "y": y,
                                        "width": width,
                                        "height": height,
                                        "rotation": rotation
                                    }
                                }))
                            },
                            "setPixelArray": function (pixelArray) {
                                checkclosed();
                                var index = 0;
                                while (index < pixelArray.length) {
                                    var item = pixelArray[index];
                                    item[0] = "rgb(" + item[0][0] + ", " + item[0][1] + ", " + item[0][2] + ")";
                                    index += 1;
                                }
                                client.send(JSON.stringify({
                                    "type": "setPixelArray",
                                    "data": {
                                        "pixelArray": pixelArray
                                    }
                                }))
                            },
                            "multipleInstructions": function (instructions) {
                                checkclosed();
                                client.send(JSON.stringify({
                                    "type": "multipleInstructions",
                                    "data": {
                                        "instructions": instructions
                                    }
                                }))
                            },
                            "close": function(){
                                checkclosed();
                                client.send(JSON.stringify({
                                    "type": "action",
                                    "data": {
                                        "action": "close"
                                    }
                                }))
                            },
                            "setImage": function(id, x, y, width, height, rotation){
                                checkclosed();
                                client.send(JSON.stringify({
                                    "type": "setImage",
                                    "data": {
                                        "id": id,
                                        "x": x,
                                        "y": y,
                                        "rotation": rotation,
                                        "width": width,
                                        "height": height
                                    }
                                }))
                            },
                            "loadImage": async function(base64, id){
                                checkclosed();
                                client.send(JSON.stringify({
                                    "type": "loadImage",
                                    "data": {
                                        "id": id,
                                        "base64": base64
                                    }
                                }))
                                while (loadedImages.includes(id) === false){
                                    await new Promise(resolve => setTimeout(resolve, 10));
                                    var index = 0;
                                    while (index < errorloadingImage.length){
                                        if (errorloadingImage[index] === id){
                                            errorloadingImage.splice(index, 1);
                                            return 1;
                                        }
                                        index += 1;
                                    }
                                }
                            },
                            "unloadImage": function(id){
                                checkclosed();
                                if (loadedImages.includes(id) === false){
                                    return 1;
                                }
                                client.send(JSON.stringify({
                                    "type": "unloadImage",
                                    "data": {
                                        "id": id
                                    }
                                }))
                                //remove from loadedImages
                                var index = 0;
                                while (index < loadedImages.length){
                                    if (loadedImages[index] === id){
                                        loadedImages.splice(index, 1);
                                        return 0;
                                    }
                                    index += 1;
                                }
                            },
                            "on": function (event, callback) {
                                if (event === "sizeUpdate"){
                                    callbacks.sizeUpdate = callback;
                                }
                                else{
                                    if (event === "close"){
                                        callbacks.close = callback;
                                    }
                                    else{
                                        if (event === "mousePositionUpdate"){
                                            callbacks.mouseposupdate = callback;
                                        }
                                        else{
                                            if (event === "keypress"){
                                                callbacks.keypress = callback;
                                            }
                                            else{
                                                if (event === "mouseclick"){
                                                    callbacks.mouseclick = callback;
                                                }
                                                else{
                                                    if (event === "mousescroll"){
                                                        callbacks.mousescroll = callback;
                                                    }
                                                    else{
                                                        if (event === "keyrelease"){
                                                            callbacks.keyrelease = callback;
                                                        }
                                                        else{
                                                            if (event === "imageload"){
                                                                callbacks.imageloaded = callback;
                                                            }
                                                            else{
                                                                if (event === "error"){
                                                                    callbacks.error = callback;
                                                                }
                                                                else{
                                                                    if (event === "imageunload"){
                                                                        callbacks.imageunloaded = callback
                                                                    }
                                                                    else{
                                                                        return 1;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        client.onclose(function(){
                            callbacks.close();
                            gameclosed = true;
                        })
                        canvas.loadImage("", "4ce2121e17989392f699ada68a9bc565")
                        await new Promise(function(resolve){setTimeout(resolve, 100)})

                        var cpheight = height;
                        var cpwidth = width;
                        var toRender = [];
                        var canvasApi = {
                            "pixel": function (x, y, rgb) {
                                if (rgb == null) {
                                    rgb = [0, 0, 0];
                                }
                                if (!(typeof rgb === "object" && rgb.length === 3)) {
                                    throw "[Nodegames] Invalid rgb value"
                                }
                                if (!(typeof x === "number" && typeof y === "number")) {
                                    throw "[Nodegames] Invalid x or y value"
                                }
                                toRender.push(canvas.get.setPixel(x, y, rgb));
                            },
                            "rect": function (x, y, height, width, rgb, rotation, outline) {
                                if (rgb == null) {
                                    rgb = [0, 0, 0];
                                }
                                if (rotation == null) {
                                    rotation = 0;
                                }
                                if (outline == null) {
                                    outline = false;
                                }
                                if (!(typeof rgb === "object" && rgb.length === 3)) {
                                    throw "[Nodegames] Invalid rgb value"
                                }
                                if (!(typeof x === "number" && typeof y === "number" && typeof height === "number" && typeof width === "number")) {
                                    throw "[Nodegames] Invalid x, y, height or width value"
                                }
                                if (!(typeof rotation === "number")) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                if (!(typeof outline === "boolean")) {
                                    throw "[Nodegames] Invalid outline value"
                                }
                                if (rotation < 0 || rotation > 360) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                if (height === 0 || width === 0) {
                                    throw "[Nodegames] Invalid height or width value"
                                }
                                toRender.push(canvas.get.setRectangle(x, y, height, width, rgb, outline, rotation));
                            },
                            "circle": function (x, y, radius, rgb, outline) {
                                if (rgb == null) {
                                    rgb = [0, 0, 0];
                                }
                                if (outline == null) {
                                    outline = false;
                                }
                                if (!(typeof rgb === "object" && rgb.length === 3)) {
                                    throw "[Nodegames] Invalid rgb value"
                                }
                                if (!(typeof x === "number" && typeof y === "number" && typeof radius === "number")) {
                                    throw "[Nodegames] Invalid x, y or radius value"
                                }
                                if (!(typeof outline === "boolean")) {
                                    throw "[Nodegames] Invalid outline value"
                                }
                                if (radius === 0) {
                                    throw "[Nodegames] Invalid radius value"
                                }
                                toRender.push(canvas.get.setCircle(x, y, radius, rgb, outline));
                            },
                            "line": function (x1, y1, x2, y2, rgb, rotation) {
                                if (rgb == null) {
                                    rgb = [0, 0, 0];
                                }
                                if (rotation == null) {
                                    rotation = 0;
                                }
                                if (!(typeof rgb === "object" && rgb.length === 3)) {
                                    throw "[Nodegames] Invalid rgb value"
                                }
                                if (!(typeof x1 === "number" && typeof y1 === "number" && typeof x2 === "number" && typeof y2 === "number")) {
                                    throw "[Nodegames] Invalid x1, y1, x2 or y2 value"
                                }
                                if (!(typeof rotation === "number")) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                if (rotation < 0 || rotation > 360) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                toRender.push(canvas.get.setLine(x1, y1, x2, y2, rgb, rotation));
                            },
                            "text": function (x, y, text, rgb, fontSize, fontName, rotation) {
                                if (rgb == null) {
                                    rgb = [0, 0, 0];
                                }
                                if (rotation == null) {
                                    rotation = 0;
                                }
                                if (!(typeof rgb === "object" && rgb.length === 3)) {
                                    throw "[Nodegames] Invalid rgb value"
                                }
                                if (!(typeof x === "number" && typeof y === "number" && typeof text === "string" && typeof fontSize === "number" && typeof fontName === "string")) {
                                    throw "[Nodegames] Invalid x, y, text, fontSize or fontName value"
                                }
                                if (!(typeof rotation === "number")) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                if (rotation < 0 || rotation > 360) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                if (fontSize < 0) {
                                    throw "[Nodegames] Invalid fontSize value"
                                }
                                if (text === "") {
                                    throw "[Nodegames] Invalid text value"
                                }
                                if (fontName === "") {
                                    throw "[Nodegames] Invalid fontName value"
                                }
                                if (fontSize === 0) {
                                    throw "[Nodegames] Invalid fontSize value"
                                }
                                if (!(typeof fontName === "string")) {
                                    throw "[Nodegames] Invalid fontName value"
                                }
                                if (!(typeof fontSize === "number")) {
                                    throw "[Nodegames] Invalid fontSize value"
                                }
                                toRender.push(canvas.get.setText(x, y, text, rgb, fontSize, fontName, rotation));
                            },
                            "clear": function (x, y, width, height, rotation) {
                                //If no argument clear whole screen
                                if (x == null && y == null && width == null && height == null){
                                    toRender.push(canvas.get.clear());
                                    return;
                                }
                                if (rotation == null){
                                    rotation = 0;
                                }
                                if (!(typeof x === "number" && typeof y === "number" && typeof width === "number" && typeof height === "number")) {
                                    throw "[Nodegames] Invalid x, y, width or height value"
                                }
                                if (!(typeof rotation === "number")) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                if (rotation < 0 || rotation > 360) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                toRender.push(canvas.get.clearZone(x, y, width, height, rotation));
                            },
                            "image": function(id, x, y, width, height, rotation){
                                if (rotation == null){
                                    rotation = 0;
                                }
                                if (!(typeof id === "string" && typeof x === "number" && typeof y === "number" && typeof width === "number" && typeof height === "number")) {
                                    throw "[Nodegames] Invalid id, x, y, width or height value"
                                }
                                if (!(typeof rotation === "number")) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                if (rotation < 0 || rotation > 360) {
                                    throw "[Nodegames] Invalid rotation value"
                                }
                                toRender.push(canvas.get.setImage(id, x, y, width, height, rotation));
                            },
                            "loadImage": async function(image, id){
                                try{
                                    image = image.toString("base64");
                                }
                                catch (error){
                                    throw JSON.stringify({
                                        "exit_code": 1,
                                        "data": {
                                            "message": "Error loading image",
                                            "problem": "Invalid image data",
                                            "id": id
                                        }
                                    }, null, 4)
                                }
                                var result = await canvas.loadImage(image, id);
                                if (result === 1){
                                    throw JSON.stringify({
                                        "exit_code": result,
                                        "data": {
                                            "message": "Error loading image",
                                            "problem": "Image data is probably invalid.",
                                            "id": id
                                        }
                                    }, null, 4)
                                }
                            },
                            "unloadImage": function(id){
                                var result = canvas.unloadImage(id);
                                if (result === 1){
                                    throw JSON.stringify({
                                        "exit_code": result,
                                        "data": {
                                            "message": "Error unloading image",
                                            "problem": "Image is probably not loaded.",
                                            "id": id
                                        }
                                    }, null, 4)
                                }
                            },
                            "on": function(event, callback){
                                if (!(typeof event === "string")){
                                    throw JSON.stringify({
                                        "exit_code": 1,
                                        "data": {
                                            "message": "Error while setting callback for event \"" + `${event}` + "\"",
                                            "problem": "Event is not a string",
                                            "event": `${event}`,
                                            "callback": (typeof callback === "function") ? callback.toString() : `${callback}`
                                        }
                                    }, null, 4)
                                }
                                if (!(typeof callback === "function")){
                                    throw JSON.stringify({
                                        "exit_code": 1,
                                        "data": {
                                            "message": "Error while setting callback for event \""  + `${event}` + "\"",
                                            "problem": "Callback isn't a function",
                                            "event": `${event}`,
                                            "callback": `${callback}`
                                        }
                                    }, null, 4)
                                }
                                var result = canvas.on(event, callback);
                                if (result === 1){
                                    throw JSON.stringify({
                                        "exit_code": result,
                                        "data": {
                                            "message": "Error while setting callback for event \"" + `${event}` + "\"",
                                            "problem": "Event is probably invalid",
                                            "event": `${event}`,
                                            "callback": callback.toString()
                                        }
                                    }, null, 4)
                                }
                            },
                            "renderFrame": function(){
                                canvas.multipleInstructions([[canvas.get.clear()].concat(toRender)]);
                                toRender = [];
                            },
                            "close": function(){
                                canvas.close();
                            }
                        }
                        callback(canvasApi)
                    }
                }
                else{
                    if (clients === 2){
                        var initialSizeUpdate = true;
                        client.onmessage(function(data){
                            data = JSON.parse(data);
                            if (data.type === "sizeupdate"){
                                width = data.data.width;
                                height = data.data.height;
                                cpheight = height;
                                cpwidth = width;
                                if (initialSizeUpdate === true){
                                    initialSizeUpdate = false;
                                    return;
                                }
                                callbacks.sizeUpdate(data.data);
                            }
                            else{
                                if (data.type === "mouseposupdate"){
                                    callbacks.mouseposupdate(data.data);
                                }
                                else{
                                    if (data.type === "keypress"){
                                        callbacks.keypress(data.data);
                                    }
                                    else{
                                        if (data.type === "mouseclick"){
                                            callbacks.mouseclick(data.data);
                                        }
                                        else{
                                            if (data.type === "mousescroll"){
                                                callbacks.mousescroll(data.data);
                                            }
                                            else{
                                                if (data.type === "keyrelease"){
                                                    callbacks.keyrelease(data.data);
                                                }
                                                else{
                                                    if (data.type === "imageLoaded"){
                                                        loadedImages.push(data.data.id);
                                                        callbacks.imageloaded(data.data.id);
                                                    }
                                                    else{
                                                        if (data.type === "errorLoadingImage"){
                                                            errorloadingImage.push(data.data.id);
                                                            callbacks.error({
                                                                "exit_code": 1,
                                                                "data": {
                                                                    "message": "Error loading image with id \"" + data.data.id + "\"",
                                                                    "problem": "Image data is probably invalid",
                                                                    "id": data.data.id
                                                                }
                                                            });
                                                        }
                                                        else{
                                                            if (data.type === "errorDrawingImage"){
                                                                callbacks.error({
                                                                    "exit_code": 1,
                                                                    "data": {
                                                                        "message": "Error drawing image with id \"" + data.data.id + "\"",
                                                                        "problem": "Image is probably not loaded",
                                                                        "id": data.data.id
                                                                    }
                                                                });
                                                            }
                                                            else{
                                                                if (data.type === "imageUnloaded"){
                                                                    //Remove from loaded images
                                                                    var index = 0;
                                                                    while (index < loadedImages.length){
                                                                        if (loadedImages[index] === data.data.id){
                                                                            loadedImages.splice(index, 1);
                                                                            break;
                                                                        }
                                                                        index += 1;
                                                                    }
                                                                    callbacks.imageunloaded(data.data.id)
                                                                }
                                                                else{
                                                                    if (data.type === "errorUnloadingImage"){
                                                                        callbacks.error({
                                                                            "exit_code": 1,
                                                                            "data": {
                                                                                "message": "Error unloading image with id \"" + data.data.id + "\"",
                                                                                "problem": "Image is probably not loaded",
                                                                                "id": data.data.id
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            });

            var spawn = require("child_process").spawn;
            var electron = spawn(/^win/.test(process.platform) ? 'electron.cmd' : 'electron', [__dirname + "/nodegames_code.js", "--arg1=" + port, "--arg2=" + width, "--arg3=" + height]);
        })
    }
}