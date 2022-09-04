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

// Particles
var RANDOM_START_BORDER_BUFFER = 20
const PARTICLE_SIZE = 5
const CELL_SIZE = Math.floor(Math.random() * 4) + 3

var particles = []

var mouseForce = 1;
var mouseActive = false;



var colors = {
    "1":"#3853F1",
    "2":"#F6E54C",
    "3":"#39D33C",
    "4":"#FFFFFF",
    "5":"#EF3029",
}

var forces = {
    "1":0,
    "2":0,
    "3":0,
    "4":0,
    "5":0,
    "6":0,
    "7":0,
    "8":0,
    "9":0,
    "10":0,
    "11":0,
    "12":0,
    "13":0,
    "14":0,
    "15":0,
    "16":0,
    "17":0,
    "18":0,
    "19":0,
    "20":0,
    "21":0,
    "22":0,
    "23":0,
    "24":0,
    "25":0,
}

var pList = {
    "1":[],
    "2":[],
    "3":[],
    "4":[],
    "5":[],
}

var particleIndex = [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [5, 5],
]