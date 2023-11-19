console.time("Total");
console.time("Require module")
var nodegames = require("./nodegames");
console.timeEnd("Require module")

console.time("Init module")
nodegames.init();
console.timeEnd("Init module")

console.time("Start game");
var mouseX = 0;
var mouseY = 0;
var width = 800;
var height = 600;
var squareX = 1;
var squareY = 1;
var img = require("fs").readFileSync("sample.png")
var img2 = require("fs").readFileSync("sample2.png")
nodegames.newGame(async function (game) {
    console.timeEnd("Start game");
    console.timeEnd("Total");

    game.on("sizeUpdate", function (event) {
        width = event.width;
        height = event.height;
        console.log("Size update", event);
    });
    game.on("close", function () {
        require("process").exit(0);
    })
    var index = 0;
    game.on("mousePositionUpdate", function (event) {
        console.log("Mouse position update", event);
        if (index < 1000) {
            squareX = event.x;
        }
        squareY = event.y;
        mouseX = event.x
        mouseY = event.y
    })
    game.on("keypress", function (event) {
        console.log("Key press", event);
    })
    game.on("mouseclick", function (event) {
        console.log("Mouse click", event);
    })
    game.on("mousescroll", function (event) {
        console.log("Mouse scroll", event);
    });
    game.on("keyrelease", function (event) {
        console.log("Key release", event);
    });
    game.on("imageload", function (id) {
        console.log("Image loaded: " + id);
    })
    game.on("error", function (error) {
        console.log("Error", error);
    })
    game.on("imageunload", function (id) {
        console.log("Image unloaded: " + id);
    });

    //Draw a rgb(80, 255, 80) square rotating in the middle of the screen
    //Close game after 1000 5 degrees rotations
    await game.loadImage(img, "id")
    await game.loadImage(img2, "id2");
    var rotation = 0;
    while (true) {
        game.image("id", squareX, squareY, width / 10, width / 10, rotation)
        game.image("id2", squareX - width / 8, squareY, width / 10, width / 10, rotation)
        game.renderFrame()
        rotation += 5;
        if (rotation === 360) {
            rotation = 0;
        }
        index += 1;
        if (index === 1000) {
            game.unloadImage("id");
        }
        if (index > 1000) {
            squareX = mouseX + width / 8
        }
        if (index === 10000) {
            game.close();
        }
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}, width, height);

//Later the game object will work with virtual objects rendered when the renderframe method is called
//The renderframe method will use multipleInstructions to render all the objects in the game to generate a frame
//The maximum stable theorical framerate would be a frame each 10ms (100fps) it seems like to be the stable websocket limit