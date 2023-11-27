//Nodegames by willmil11 [Electron controller]
//

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

var app = require("electron").app;
var BrowserWindow = require("electron").BrowserWindow;

var port = app.commandLine.getSwitchValue("arg1");
var width = app.commandLine.getSwitchValue("arg2");
var height = app.commandLine.getSwitchValue("arg3");

var createWindow = function () {
    var window = new BrowserWindow({
        "width": parseInt(width),
        "height": parseInt(height),
        "webPreferences": {
            "webSecurity": false
        }
    })
    window.setMenuBarVisibility(false)

    window.loadFile("index.html");

    //Wait for load
    window.webContents.on("did-finish-load", function () {
        var screenWidth = window.getSize().width;
        var screenHeight = window.getSize().height;

        var clickX = screenWidth / 2;
        var clickY = screenHeight / 2;

        window.webContents.sendInputEvent({
            type: 'mouseDown',
            button: 'left',
            clickCount: 1,
            x: clickX,
            y: clickY
        });

        window.webContents.sendInputEvent({
            type: 'mouseUp',
            button: 'left',
            clickCount: 1,
            x: clickX,
            y: clickY
        });
        window.webContents.executeJavaScript("var port = " + port + ";");

        //Set the variable "visible" to the visibility of the window
        //Change it when the window is minimized or maximized
        window.webContents.executeJavaScript("var visible = " + window.isVisible() + ";");
        window.on("minimize", function () {
            window.webContents.executeJavaScript("visible = false;");
        });
        window.on("maximize", function () {
            window.webContents.executeJavaScript("visible = true;");
        });
    });
    
    return window;
}

app.on("window-all-closed", function () {
    app.quit();
})

//When ready create window
app.on("ready", function () {
    var window = createWindow();
})