# Nodegames 1.1.6 by willmil11
## Installation
1. You will be required to have node.js and npm installed as well as having an internet connection.
2. Run the following command: `npm install nodegamesjs`
3. You are now ready to use nodegames!
## Update
1. You will be required to have node.js and npm installed as well as having an internet connection.
2. Run the following command: `npm update nodegamesjs`
3. You are now ready to use nodegames!
## Package your game to an executable
Use <a href="https://www.npmjs.com/package/nodegamesjs-forge">nodegamesjs-forge</a> (in-dev so won't work well at all,<strong> at least for now</strong>)
## Usage
First you'll have to require the module.
```js
var nodegames = require("nodegamesjs");
```
Then init nodegames with the following code:
```js
//This will take no time if everything is correctly installed.
//If it's not the case it will install the missing dependecies logging the progress.
nodegames.init();
```
Then create a game with the following code:
```js
var game = nodegames.newGame(function (game) {
    // The callback will be called once the game window has opened and is ready.
    // "game" is the game object that you'll use to control the game.
}, width, height)
//Change the above "width" and "height" to the actual width and height
```
In the following stuff "game" represents the callback argument and as so the game object if you change the argument name you'll have to change the name in the following stuff.
### Set window name
As the default name for your game window is "Untitled" you'll probably want to change it.
```js
game.setWindowName("My game"); //Replace "My game" with the name you want.
```
### Events
Here is the event list:
- "resize": Called when the window is resized.
- "close": Called when the window is closed.
- "mousemove": Called when the mouse is moved on the window.
- "keypress": Called when a key is pressed with the window focused.
- "keyrelease": Called when a key is released with the window focused.
- "mouseclick": Called when a mouse button is clicked with the window focused.
- "mousescroll": Called when the mouse is scrolled on the window.
- "imageload": Called when an image has been successfully loaded.
- "imageunload": Called when an image has been successfully unloaded.
- "error": Called when an error of any kind happens.
- "framerender": Called when a frame is rendered.
- "soundload": Called when a sound has been successfully loaded.
- "soundunload": Called when a sound has been successfully unloaded.
- "soundstop": Called when a sound has been successfully stoped from playing.

To use these events:
```js
//Resize event
game.on("resize", function (event) {
    //"event" object contains:
    var width = event.width; //The new width
    var height = event.height; //The new height
    console.log("Resized to: " + width + "x" + height);
})
```
```js
//Close event
game.on("close", function () {
    console.log("Game window closed.");
})
```
```js
//Mousemove event
game.on("mousemove", function (event) {
    //"event" object contains
    var x = event.x //The new x coordinate of the mouse
    var y = event.y //The new y coordinate of the mouse
    var direction = event.direction //The direction the mouse is going to (up, down, left, right, upright, upleft, downright, downleft)
    var speed = event.speed //The speed the mouse moved
    var movement = event.movement //The raw movement values
    var movementX = movement.x //The x raw movement value
    var movementY = movement.y //The y raw movement value
    console.log("Moved mouse to " + x + ", " + y + " in direction: " + direction + " at speed: " + speed);
})
```
```js
//Keypress event
game.on("keypress", function (event) {
    //"event" object contains
    var key = event.key; //Which key has been pressed
    var shiftKey = event.shiftKey; //Is shift pressed while pressing that key
    var ctrlKey = event.ctrlKey; //Is control pressed while pressing that key
    console.log("Key pressed: " + key + ", is shift pressed: " + shiftKey + ", is control pressed: " + ctrlKey);
})
```
```js
//Keyrelease event
game.on("keyrelease", function (event) {
    //"event" object contains
    var key = event.key; //Which key has been released
    var shiftKey = event.shiftKey; //Was shift pressed when the key was still pressed
    var ctrlKey = event.ctrlKey; //Was control pressed when the key was still pressed
    console.log("Key released: " + key + ", was shift pressed: " + shiftKey + ", was control pressed: " + ctrlKey);
})
```
```js
//Mouseclick event
game.on("mouseclick", function (event) {
    //"event" object contains
    var button = event.button; //Mouse button (scrollwheel, left, right, side1, side2)
    var x = event.x; //x position of mouse click
    var y = event.y; //y position of mouse click
    console.log("Mouse button pressed: " + button + " at " + x + ", " + y)
})
```
```js
//Mousescroll event
game.on("mousescroll", function (event) {
    //"event" object contains:
    var direction = event.direction; //Direction of scroll (up, down, left, right)
    var speed = event.speed; //Speed of scroll
    console.log("Scrolling " + direction + " at speed: " + speed)
})
```
```js
//Imageload event
game.on("imageload", function (id) {
    //"id" is the loaded image id
    console.log("Image with id: " + id + " loaded.")
})
```
```js
//Imageunload event
game.on("imageunload", function (id) {
    //"id" is the unloaded image id
    console.log("Image with id: " + id + " unloaded.")
})
```
```js
//Error event
game.on("error", function (error) {
    //"error" object contains:
    var exit_code = error.exit_code; //Always 1 as 1 represents an error.
    var message = error.data.message; //Message (what is the error that happened)
    var problem = error.data.problem; //Problem (what went wrong)
    
    //For some errors (with the image and sound related errors) there is the image/sound id
    var id = error.data.id; //May be null for non image/sound related errors

    console.log("Error with exit code: " + exit_code + ", message: " + message + " and problem " + problem)
})
```
```js
//Framerender event
game.on("framerender", function () {
    console.log("Rendered a frame.")
})
```
```js
//Soundload event
game.on("soundload", function (id) {
    //"id" is the loaded sound id
    console.log("Sound with id: " + id + " loaded.")
})
```
```js
//Soundunload event
game.on("soundunload", function (id) {
    //"id" is the unloaded sound id
    console.log("Sound with id: " + id + " unloaded.")
})
```
```js
//Soundstop event
game.on("soundstop", function (id) {
    //"id" is the sound stopped from playing id
    console.log("Sound with id: " + id + " has been stopped from playing.")
})
```

### Draw
To draw stuff you can use the following:
```js
//Draw a pixel
//
//Syntax: game.pixel(x:int, y:int, rgb:array
//

//Example:
game.pixel(0, 0, [255, 255, 255]) //White pixel at coordinates 0, 0
```
```js
//Draw a rectangle
//
//Syntax: game.rect(x:int, y:int, height:int, width:int, rgb:array, rotation:int/null, hollow?:boolean/null)
//

//Examples:
game.rect(0, 0, 10, 10, [255, 255, 255]) //White rectangle at coordinates 0, 0 of width and height 10px, rotation of 0 degrees, not hollow
game.rect(0, 0, 10, 10, [255, 255, 255], 45) //White rectangle at coordinates 0, 0 of width and height 10px, rotation of 45 degrees, not hollow
game.rect(0, 0, 10, 10, [255, 255, 255], 45, true) //White rectangle at coordinates 0, 0 of width and height 10px, rotation of 45 degrees, hollow
game.rect(0, 0, 10, 10, [255, 255, 255], 45, false) //White rectangle at coordinates 0, 0 of width and height 10px, rotation of 45 degrees, not hollow
```
```js
//Draw a circle
//
//Syntax: game.circle(x:int, y:int, radius:int/float, rgb:array, hollow?:boolean/null)
//

//Exemples:
game.circle(0, 0, 10, [255, 255, 255]) //White circle at coordinates 0, 0 of radius 10px, not hollow
game.circle(0, 0, 10, [255, 255, 255], true) //White circle at coordinates 0, 0 of radius 10px, hollow
game.circle(0, 0, 10, [255, 255, 255], false) //White circle at coordinates 0, 0 of radius 10px, not hollow
```
```js
//Draw a line
//
//Syntax: game.line(x1:int, y1:int, x2:int, y2:int, rgb:array, rotation:int/null)
//

//Examples:
game.line(0, 0, 10, 0, [255, 255, 255]) //White line from coordinates 0, 0 to 10, 0 with a rotation of 0 degrees
game.line(0, 0, 10, 0, [255, 255, 255], 45) //White line from coordinates 0, 0 to 10, 0 with a rotation of 45 degrees
```
```js
//Draw text
//
//Syntax: game.text(x:int, y:int, text:string, rgb:array, fontSize:int, fontName:string, rotation:int/null)
//

//Examples:
game.text(0, 0, "Hello world!", [255, 255, 255], 10, "Arial") //"Hello world!" in white at coordinates 0, 0 with font name "Arial" font size 10 and a rotation of 0 degrees.
game.text(0, 0, "Hello world!", [255, 255, 255], 10, "Arial", 45) //"Hello world!" in white at coordinates 0, 0 with font name "Arial" font size 10 and a rotation of 45 degrees.
```
```js
//Clear window/rectangle
//
//Syntax: game.clear() or game.clear(x:int, y:int, width:int, height:int, rotation:int/null)
//

//Examples:
game.clear() //Clear whole window
game.clear(0, 0, 10, 10) //Clear a rectangle of 10px as width and height at coordinates 0, 0 with for rotation 0 degrees
game.clear(0, 0, 10, 10, 45) //Clear a rectangle of 10px as width and height at coordinates 0, 0 with for rotation 45 degrees
```
```js
//Draw image
//
//Syntax: game.image(image_id:string, x:int, y:int, width:int, height:int, rotation:int/null)
//

//Examples:
game.image("My_image", 0, 0, 10, 10) //Image loaded with id "My_image" at coordinates 0, 0, with for width and height 10px and for rotation 0 degrees
game.image("My_image", 0, 0, 10, 10, 45) //Image loaded with id "My_image" at coordinates 0, 0, with for width and height 10px and for rotation 45 degrees
```

After 'drawing' all of your stuff you'll notice nothing is displayed on the window it's because you have to render it with the renderFrame method, add this after 'drawing' all of your stuff:
```js
game.renderFrame()
```
It is not recommanded to render frames quicker than each 10ms (100fps) as it is the maximum stable fps you can get with nodegames. If you exceed it can lag a lot.
### Loading/unloading images
To load/unload an image do this:
```js
game.loadImage(image, id)
```
Image must be a jpg or png that you can get like this:
```js
var fs = require("fs")
var image = fs.readFileSync("/path/to/image");
```

The 'problem' of the loadImage method is that it returns a promise so it is not syncronous but the good thing about that is that you can just use .then or await to set a callback or wait for the image to be loaded.
<br>
<br>
Now to unload an image you can do the following:
```js
game.unloadImage(id)
```
This should unload the image, this does not return any kind of promise tho. just assume it is 'syncronous' and unloads the image instantly which is almost the case

### Loading/unloading and playing/stopping sounds
To load/unload a sound do this:
```js
game.loadSound(sound, id)
```
Sound must be a wav or mp3 that you can get like this:
```js
var fs = require("fs")
var sound = fs.readFileSync("/path/to/sound");
```

The 'problem' of the loadSound method is that it returns a promise so it is not syncronous but the good thing about that is that you can just use .then or await to set a callback or wait for the sound to be loaded.
<br>
<br>
Now to unload a sound you can do the following:
```js
game.unloadSound(id)
```
This should unload the sound, this does not return any kind of promise tho. just assume it is 'syncronous' and unloads the sound instantly which is almost the case
<br>
<br>
To play a sound you can do the following:

```js
//
//Syntax: game.playSound(id:string, loop:boolean/null, volume:int(0-100)/null)
//

//Examples:
game.playSound("My_sound") //Play sound with id "My_sound" once at volume 100%
game.playSound("My_sound", true) //Play sound with id "My_sound" in loop at volume 100%
game.playSound("My_sound", false) //Play sound with id "My_sound" once at volume 100%
game.playSound("My_sound", true, 50) //Play sound with id "My_sound" in loop at volume 50%
game.playSound("My_sound", false, 50) //Play sound with id "My_sound" once at volume 50%
```
To stop a sound you can do the following:
```js
game.stopSound(id)
```
This should stop the sound from playing.

### Pointer control
To hide the pointer:
```js
game.pointer.hide()
```
To show the pointer:
```js
game.pointer.show()
```
To try to lock the pointer
```js
game.pointer.lock()
```
To unlock the pointer
```js
game.pointer.unlock()
```
#### Change pointer style
Here is the pointer style list:
- "default"
- "context-menu"
- "help"
- "pointer"
- "progress"
- "wait"
- "cell"
- "crosshair"
- "text"
- "vertical-text"
- "alias"
- "copy"
- "move"
- "no-drop"
- "not-allowed"
- "grab"
- "grabbing"
- "all-scroll"
- "col-resize"
- "row-resize"
- "n-resize"
- "e-resize"
- "s-resize"
- "w-resize"
- "ne-resize"
- "nw-resize"
- "se-resize"
- "sw-resize"
- "ew-resize"
- "ns-resize"
- "nesw-resize"
- "nwse-resize"
- "zoom-in"
- "zoom-out"

<br>
To change pointer style:

```js
game.pointer.setStyle(style); //Replace "style" with the pointer style you want
```

## Help me
If you'd like to help you can take a peek at the code, enable/disable devtools in the game window like this:
```js
game.cheats.devtools.enable(); //Enable devtools
game.cheats.devtools.disable(); //Disable devtools
```
And then press F12 to open devtools.
<br>
<br>
If you find bugs or have a suggestion you can send them in the <a href="https://github.com/willmil11/Nodegames/issues">issues tab</a>.

## Github
<a href="https://github.com/willmil11/Nodegames/">Click to go to the repo</a>

## Changelog
### 1.1.6
- Updated readme.
### 1.1.5
- Edited readme and added a minor feature: before it was not shown that you can play a sound in loop. And the minor feature is that now you can choose the volume of a sound when playing it.
### 1.1.4
- Changed readme to indicate that nodegamesjs-forge is released and added a link to the npm page.
### 1.1.3
- Upgraded what 1.1.2 added.
### 1.1.2
- Added some code to prepare for nodegamesjs-forge release (will be a way to package your game to an executable).
### 1.1.1
- Little fix in the readme.
### 1.1.0
- Added a way to change pointer style
### 1.0.0
- Initial release