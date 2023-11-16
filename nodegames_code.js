//Nodegames by willmil11 [Electron controller]
//

var app = require("electron").app;
var BrowserWindow = require("electron").BrowserWindow;

var port = app.commandLine.getSwitchValue("arg1");
var width = app.commandLine.getSwitchValue("arg2");
var height = app.commandLine.getSwitchValue("arg3");

var createWindow = function () {
    var window = new BrowserWindow({
        "width": parseInt(width),
        "height": parseInt(height)
    })
    window.setMenuBarVisibility(false)

    window.loadFile("index.html");

    return window;
}

app.on("window-all-closed", function(){
    app.quit();
})

//When ready create window
app.on("ready", function () {
    var window = createWindow();
    window.webContents.executeJavaScript("var port = " + port + ";");
})