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

        var port;
        portget().then(function (out) {
            port = parseInt(out);
            //"port" variable now contains a free port

            var clients = 0;
            var canvas = null;
            easynodes.websocket.newServer(port, function (client) {
                clients += 1;
                if (clients === 2) {
                    client.close();
                    clients -= 1;
                    return;
                }
                if (clients === 1) {
                    if (canvas === null) {
                        var callbacks = {
                            "sizeUpdate": function(){},
                            "close": function(){},
                            "mouseposupdate": function(){},
                            "keypress": function(){},
                            "mouseclick": function(){},
                            "mousescroll": function(){},
                            "keyrelease": function(){}
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
                                }
                            },
                            "setPixel": function (x, y, rgb) {
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
                                client.send(JSON.stringify({
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
                                client.send(JSON.stringify({
                                    "type": "rawctx",
                                    "data": {
                                        "rawctx": rawctx
                                    }
                                }))
                            },
                            "clearZone": function (x, y, width, height) {
                                client.send(JSON.stringify({
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
                                client.send(JSON.stringify({
                                    "type": "setPixelArray",
                                    "data": {
                                        "pixelArray": pixelArray
                                    }
                                }))
                            },
                            "multipleInstructions": function (instructions) {
                                client.send(JSON.stringify({
                                    "type": "multipleInstructions",
                                    "data": {
                                        "instructions": instructions
                                    }
                                }))
                            },
                            "close": function(){
                                client.send(JSON.stringify({
                                    "type": "action",
                                    "data": {
                                        "action": "close"
                                    }
                                }))
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
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        var initialSizeUpdate = true;
                        client.onmessage(function(data){
                            data = JSON.parse(data);
                            if (data.type === "sizeupdate"){
                                width = data.data.width;
                                height = data.data.height;
                                if (initialSizeUpdate === true){
                                    initialSizeUpdate = false;
                                    return;
                                }
                                callbacks.sizeUpdate(data.data.width, data.data.height);
                            }
                            else{
                                if (data.type === "mouseposupdate"){
                                    callbacks.mouseposupdate(data.data.x, data.data.y);
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
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        client.onclose(function(){
                            callbacks.close();
                        })
                        callback(canvas)
                    }
                }
            });

            var spawn = require("child_process").spawn;
            var electron = spawn(/^win/.test(process.platform) ? 'electron.cmd' : 'electron', [__dirname + "/nodegames_code.js", "--arg1=" + port, "--arg2=" + width, "--arg3=" + height]);
        })
    }
}