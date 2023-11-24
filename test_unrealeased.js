//TODO: Fix pointerlock and unlock events
//TODO: Fix error event (pointer lock error part)

console.time("Total");
console.time("Require module")
var nodegames = require("./nodegames");
console.timeEnd("Require module")

console.time("Init module")
nodegames.init();
console.timeEnd("Init module")

console.time("Start canvas");
var mouseX = 0;
var mouseY = 0;
var width = 800;
var height = 600;
var squareX = 1;
var squareY = 1;
var img = require("fs").readFileSync("sample.png")
var img2 = require("fs").readFileSync("sample2.png")
var sound = require("fs").readFileSync("sample.mp3")
nodegames.newCanvas(async function (canvas) {
    console.timeEnd("Start canvas");
    console.timeEnd("Total");

    canvas.on("sizeUpdate", function (event) {
        width = event.width;
        height = event.height;
        console.log("Size update", event);
    });
    canvas.on("close", function () {
        require("process").exit(0);
    })
    var index = 0;
    canvas.on("mousePositionUpdate", function (event) {
        console.log("Mouse position update", event);
        if (index < 1000) {
            squareX = event.x;
        }
        squareY = event.y;
        mouseX = event.x
        mouseY = event.y
    })
    canvas.on("keypress", function (event) {
        console.log("Key press", event);
    })
    canvas.on("mouseclick", function (event) {
        console.log("Mouse click", event);
    })
    canvas.on("mousescroll", function (event) {
        console.log("Mouse scroll", event);
    });
    canvas.on("keyrelease", function (event) {
        console.log("Key release", event);
    });
    canvas.on("imageload", function (id) {
        console.log("Image loaded: " + id);
    })
    canvas.on("error", function (error) {
        console.log("Error", error);
    })
    canvas.on("imageunload", function (id) {
        console.log("Image unloaded: " + id);
    });
    var frameCount = 0;

    canvas.on("framerender", function () {
        frameCount += 1;
    });
    canvas.on("soundload", function (id) {
        console.log("Sound loaded: " + id);
    });
    canvas.on("soundunload", function (id) {
        console.log("Sound played: " + id);
    });
    canvas.on("soundstop", function (id) {
        console.log("Sound stopped: " + id);
    })
    canvas.on("pointerlock", function () {
        console.log("Pointer locked");
    })
    canvas.on("pointerunlock", function () {
        console.log("Pointer unlocked");
    })
    canvas.cheats.devtools.enable()
    setTimeout(function () {
        canvas.pointer.lock();
    }, 1000)
    setTimeout(function () {
        canvas.pointer.unlock();
        canvas.cheats.devtools.disable();
    }, 5000)

    setInterval(function () {
        var fps = frameCount;
        console.log(`FPS: ${fps}`);
        frameCount = 0;
    }, 1000);

    setTimeout(function () {
        canvas.setWindowName("Now titled")
    }, 5000)

    //Draw a rgb(80, 255, 80) square rotating in the middle of the screen
    //Close canvas after 1000 5 degrees rotations
    await canvas.loadImage(img, "id")
    await canvas.loadImage(img2, "id2");
    await canvas.loadSound(sound, "sound");
    setTimeout(function () {
        canvas.playSound("sound", true);
        setTimeout(function () {
            canvas.stopSound("sound");
            setTimeout(function () {
                canvas.playSound("sound", false);
            }, 3000)
        }, 7000)
    }, 3000);
    var rotation = 0;
    while (true) {
        canvas.image("id", squareX, squareY, width / 10, width / 10, rotation)
        canvas.image("id2", squareX - width / 8, squareY, width / 10, width / 10, rotation)
        canvas.renderFrame()
        rotation += 5;
        if (rotation === 360) {
            rotation = 0;
        }
        index += 1;
        if (index === 1000) {
            canvas.unloadImage("id");
        }
        if (index > 1000) {
            squareX = mouseX + width / 8
        }
        if (index === 10000) {
            canvas.close();
        }
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}, width, height);