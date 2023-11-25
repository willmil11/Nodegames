var nodegames = require("./nodegames");
nodegames.init();
nodegames.newCanvas(async function (canvas) {
    var mouseX = -20;
    var mouseY = -20;
    canvas.on("mousemove", function (event) {
        mouseX = event.x;
        mouseY = event.y;
    })
    var rotation = 0;
    while (true){
        if (rotation > 360){
            rotation = 0;
        }
        await canvas.rect(0, 0, 800, 600, [0, 0, 0])
        await canvas.circle(400, 300, 100, [255, 0, 0], true)
        //smaller circle centered inside the red circle
        await canvas.circle(400, 300, 50, [0, 255, 0])
        await canvas.text(100, 100, "Hello world!", [255, 255, 255], 20, "Arial", rotation)
        await canvas.text(mouseX, mouseY, "I'm following you", [255, 255, 255], 25, "Arial")
        //rotating line at the right of the big circle
        await canvas.line(600, 300, 700, 300, [255, 255, 255], rotation)
        //red blue and green pixels at the left of the big circle
        await canvas.pixel(150, 300, [255, 0, 0])
        await canvas.pixel(200, 300, [0, 255, 0])
        await canvas.pixel(250, 300, [0, 0, 255])
        await canvas.renderFrame()
        rotation += 5
        await new Promise((resolve) => setTimeout(resolve, 10))
    }
}, 800, 600)