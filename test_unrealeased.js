console.time("Total");
console.time("Require module")
var nodegames = require("./nodegames");
console.timeEnd("Require module")

console.time("Init module")
nodegames.init();
console.timeEnd("Init module")

console.time("Start game");
var width = 800;
var height = 600;
nodegames.newGame(async function (game) {
    console.timeEnd("Start game");
    console.timeEnd("Total");

    game.on("sizeUpdate", function (w, h) {
        console.log("Size update", w, h);
    });
    game.on("close", function(){
        require("process").exit(0);
    })
    game.on("mousePositionUpdate", function (x, y) {
        console.log("Mouse position update", x, y);
    })
    game.on("keypress", function (event) {
        console.log("Key press", event);
    })
    game.on("mouseclick", function(event){
        console.log("Mouse click", event);
    })
    game.on("mousescroll", function(event){
        console.log("Mouse scroll", event);
    });
    game.on("keyrelease", function(event){
        console.log("Key release", event);
    });

    //Draw a rgb(80, 255, 80) square rotating in the middle of the screen
    //Close game after 1000 5 degrees rotations
    var rotation = 0;
    var index = 0;
    while (true){
        game.multipleInstructions([
            game.get.clear(),
            game.get.setRectangle(width / 2 - 50, height / 2 - 50, 100, 100, [80, 255, 80], false, rotation)
        ])
        rotation += 5;
        if (rotation === 360){
            rotation = 0;
        }
        index += 1;
        if (index === 1000){
            game.close();
        }
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}, width, height);

//Later the game object will work with virtual objects rendered when the renderframe method is called
//The renderframe method will use multipleInstructions to render all the objects in the game to generate a frame
//The maximum stable theorical framerate would be a frame each 10ms (100fps) it seems like to be the stable websocket limit