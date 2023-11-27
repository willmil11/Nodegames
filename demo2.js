var nodegames = require("./nodegames");
nodegames.init();
nodegames.newGame(async function (game) {
    console.log("[Demo] game started.")
    console.log("[Demo] Reading data...")
    var fs = require("fs");
    var image = fs.readFileSync("./sample.png");
    var sound = fs.readFileSync("./sample.mp3");
    var mouseX = -20;
    var mouseY = -20;
    var followRotation = 0;
    var height = 600;
    var width = 800;
    game.on("resize", function (event) {
        console.log("[Demo] Resize from " + width + "x" + height + " to " + event.width + "x" + event.height);
        width = event.width;
        height = event.height;
    });
    game.on("mousemove", function (event) {
        console.log("[Demo] Mouse move from " + mouseX + "," + mouseY + " to " + event.x + "," + event.y);
        mouseX = event.x;
        mouseY = event.y;
    })
    game.on("mouseclick", function (event) {
        if (event.button === "left"){
            console.log("[Demo] Left click");

            //If click colides with button
            if (mouseX > width / 5 && mouseX < width / 5 + width / 9 && mouseY > height / 1.5 - width / 9 / 2 && mouseY < height / 1.5 - width / 9 / 2 + width / 9){
                console.log("[Demo] Button clicked");
                game.playSound("sound");
            }

            followRotation = 0;
        }
        else{
            if (event.button === "right"){
                console.log("[Demo] Right click");
                followRotation += 45;
                if (followRotation > 360){
                    followRotation = 0;
                }
            }
        }
    });
    game.on("mousescroll", function (event) {
        if (event.direction === "up"){
            console.log("[Demo] Mouse scroll up");
            followRotation += event.speed
            if (followRotation > 360){
                followRotation = 0;
            }
        }
        else{
            if (event.direction === "down"){
                console.log("[Demo] Mouse scroll down");
                followRotation += event.speed
                if (followRotation < 0){
                    followRotation = 360;
                }
            }
        }
    });

    await game.loadImage(image, "image");
    await game.loadSound(sound, "sound");
    var ref = (height > width) ? height : width
    var textSize = await game.measureText("I'm following the cursor", ref / 40, "Arial")
    await game.text(mouseX - (textWidth / 2), mouseY - (textHeight / 2), "I'm following the cursor", [255, 255, 255], (ref / 30), "Arial", followRotation)
    var oldTextSize = textSize

    var rotation = 0;
    while (true){
        if (rotation > 360){
            rotation = 0;
        }
        await game.rect(0, 0, width, height, [0, 0, 0])
        await game.circle(width / 2, height / 1.5, width / 9, [255, 0, 0], true)
        await game.circle(width / 2, height / 1.5, width / 20, [0, 255, 0])
        await game.text(width / 9, width / 9, "Hello world!", [255, 255, 255], ref / 30, "Arial", rotation)
        await game.line(width / 1.5, height / 2 + height / 2 / 2, width / 1.1, height / 2, [255, 255, 255], rotation)
        await game.pixel(width / 8, height / 2, [255, 0, 0])
        await game.pixel(width / 7.5, height / 2, [0, 255, 0])
        await game.pixel(width / 7, height / 2, [0, 0, 255])
        await game.rect(width / 2 - width / 9 / 2, height / 9, width / 9, width / 9, [255, 0, 0], rotation, true)
        await game.rect(width / 2 + width / 45 - width / 9 / 2, height / 9 + width / 45, width / 15, width / 15, [0, 255, 0], rotation)
        await game.image("image", width / 1.3, height / 9, width / 9, width / 9, rotation)
        //Below the 3 pixels a button (rect with text inside)

        await game.rect(width / 5, height / 1.5 - width / 9 / 2, width / 9, width / 9, [255, 255, 255])
        await game.text(width / 5, height / 1.5 - width / 9 / 2 + width / 18, "Click me!", [0, 0, 0], ref / 40, "Arial")

        var textWidth = textSize.width
        var textHeight = textSize.height

        if (!(oldTextSize === textSize)){
            ref = (height > width) ? height : width
            textSize = await game.measureText("I'm following the cursor", ref / 40, "Arial")
            oldTextSize = textSize
        }
        else{
            textSize = await game.measureText("I'm following the cursor", ref / 40, "Arial")
        }

        await game.text(mouseX - (textWidth / 2), mouseY - (textHeight / 2), "I'm following the cursor", [255, 255, 255], (ref / 30), "Arial", followRotation)
        await game.renderFrame()
        rotation += 5
        await new Promise((resolve) => setTimeout(resolve, 10))
    }
}, 800, 600)