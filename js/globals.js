const CAN_ID_F = "myCanvasFront" // Canvas ID Foreground
const CAN_ID_B = "myCanvasBack" // Canvas ID Background

var ctxf = null; // Foreground context
var ctxb = null; // Background context

var cW = document.body.clientWidth; // Canvas Width
var cH = document.body.clientHeight; // Canvas Height

var backgroundChanged = false // Check if background needs to be updated.

// FPS
var fpsShow = true; // Display FPS
var fpsOldDate = Date.now(); 
var fpsNewDate = Date.now();
var fps = 60;
var fpsCounter = 0

// Buttons
var handleButtonHover = true // Should buttons handle hover
var buttons = [] // Clickable Buttons

// Mouse
var mouseDownX = 0
var mouseDownY = 0
var mouseX = 0 // Track movement
var mouseY = 0

// Images
const IMG_PATH = "res/"
var IMG_BUTTON = new Image;
IMG_BUTTON.src = IMG_PATH + "button.png";
