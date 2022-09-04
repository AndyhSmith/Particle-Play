

//----------------------------------------------------------------------------------------------------
//   B U T T O N   C A L L B A C K S
//----------------------------------------------------------------------------------------------------
function bHRed() {
    console.log("Red Hover");
}

function bCRed() {
    console.log("Red Click");
}

function bHGreen() {
    console.log("Green Hover");
}

function bCGreen() {
    console.log("Green Click");
}

function defaultHover(i) {
    let scale = .1
    let xAmount = scale * buttons[i].w
    let yAmount = scale * buttons[i].h
    buttons[i].x = buttons[i].xF - xAmount;
    buttons[i].w = buttons[i].wF + (xAmount * 2);
    buttons[i].y = buttons[i].yF - yAmount;
    buttons[i].h = buttons[i].hF + (yAmount * 2);
    buttons[i].ts = buttons[i].tsF + (scale * buttons[i].h * .8);
}

function defaultRemoveHover(i) {
    buttons[i].x = buttons[i].xF;
    buttons[i].w = buttons[i].wF;
    buttons[i].y = buttons[i].yF;
    buttons[i].h = buttons[i].hF;
    buttons[i].ts = buttons[i].tsF;
}


//----------------------------------------------------------------------------------------------------
//    M O U S E
//----------------------------------------------------------------------------------------------------
function handleClick() {
    for (let i in buttons) {
        if (checkCollisionPoint(buttons[i], mouseDownX,mouseDownY)) {
            buttons[i].handleClick()
        }
    }
}

function handleMouseMove() {
    if (handleMouseMove) {
        let hovering = false
        for (let i in buttons) {
            if (checkCollisionPoint(buttons[i], mouseX, mouseY)) {
                hovering = true
                buttons[i].handleHover(i)
            } else {
                if(buttons[i].removeHover != undefined) {
                    buttons[i].removeHover(i)
                }
            }
        }
        if (hovering) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }
}

//----------------------------------------------------------------------------------------------------
//   D R A W I N G
//----------------------------------------------------------------------------------------------------
// Draw Foreground
function drawFront() { 
    ctxf.clearRect(0, 0, cW, cH); 
    // drawButtons()

    for (let i = 0; i < particles.length; i++) {
        drawRectangle(particles[i].x, particles[i].y, particles[i].c, PARTICLE_SIZE)
    }


    drawFPS()
}

// Draw Background
function drawBack() { 

}

//----------------------------------------------------------------------------------------------------
//   U P D A T E
//----------------------------------------------------------------------------------------------------

// yellow = createGroup(400, "yellow");
// red = createGroup(400, "red");
// green = createGroup(200, "green");
function dragonFly() {
    rule(green, green, -.16)
    rule(green, red, -.08)
    rule(green, yellow, 0.17)
    rule(red, red, -0.05)
    rule(red, green, -0.18)
    rule(yellow, yellow, 0.08)
    rule(yellow, green, -0.10)
}
function greenAtom() {
    rule(red, red, 0.1)
    rule(red, yellow, 0.15)
    rule(green, green, -0.7)
    rule(green, red, -0.2)
    rule(red, green, -0.1)
}

function unstableParticle() {
    rule(green, green, -.9)
    rule(green, red, -.08)
    rule(green, yellow, 0.17)
    rule(red, red, -0.05)
    rule(red, green, -0.18)
    rule(yellow, yellow, 0.08)
    rule(yellow, green, -0.60)
}

function stableGrandParticle() {
    rule(green, green, -2)
    rule(green, red, -.08)
    rule(green, yellow, 0.17)
    rule(red, red, -0.05)
    rule(red, green, -0.18)
    rule(yellow, yellow, 0.08)
    rule(yellow, green, -0.60)
}

function simpleBlue() {
    rule(green, green, -2)
    rule(green, red, -.08)
    rule(green, yellow, 0.17)
    rule(red, red, -0.05)
    rule(red, green, -0.18)
    rule(yellow, yellow, 0.08)
    rule(yellow, green, -0.60)
    rule(red, blue, .5)
    rule(blue, blue, .1)
    rule(blue, red, .5)
}


function deannaRule() {
    rule(green, blue, -1)
    rule(blue, green, 1)
    rule(yellow, yellow, .001)
    rule(red, yellow, -.8)
    rule(yellow, green, .6)
    rule(red, red, .3)
    rule(blue, blue, .1)
}


function update() {
    // greenAtom()
    // dragonFly()
    // unstableParticle()
    // stableGrandParticle()
    // simpleBlue()
    // deannaRule()
    let mousePart = [createParticle(mouseX, mouseY, 1)]

    for (let i = 0; i < 25; i++) {
        // if (forces[i] != 0) {
            rule(pList[particleIndex[i][0]], pList[particleIndex[i][1]], forces[i+1])
            if (mouseActive) {
            rule(pList[particleIndex[i][0]],mousePart,mouseForce)
            }
        // }
    }
    for (let i = 0; i < 25; i++) {
        updateRule(pList[particleIndex[i][0]], pList[particleIndex[i][1]], forces[i+1])
        if (mouseActive) {
        updateRule(pList[particleIndex[i][0]],mousePart,mouseForce)
        }
    }
    
    
}

function gameLoop() {
    if (backgroundChanged) {drawBack()}
    calcFPS()
    update()
    drawFront()
    window.requestAnimationFrame(gameLoop);
}

//----------------------------------------------------------------------------------------------------
//   P A R T I C L E S
//----------------------------------------------------------------------------------------------------

function rule(p1, p2, g) {
    g = -g
    for (let i = 0; i < p1.length; i++) {
        let fx = 0;
        let fy = 0;
        let a = null;
        let b = null;
        for (let j = 0; j < p2.length; j++) {
            a = p1[i]
            b = p2[j]
            

            let tbx = b.x
            let tby = b.y
            // Screen Wrap attempt
            // if (a.x < cW * .25 && b.x > cW * .75) {
            //     tbx -= cW
            // }
            // if (a.x > cW * .75 && b.x < cW * .25) {
            //     tbx += cW
            // }

            
            // if (a.y < cH * .25 && b.y > cH * .75) {
            //     tby -= cH
            // }
            // if (a.y > cH * .75 && b.y < cH * .25) {
            //     tby += cH
            // }

            
            let dx = a.x-tbx;
            let dy = a.y-tby;
            let d = Math.sqrt(dx*dx + dy*dy);
            if (d > 0 && d <  (cW / CELL_SIZE) ) {
                let F = g * 1 / d
                fx += (F * dx)
                fy += (F * dy)
            }
            
        }
        a.vx = (a.vx + fx) * .5
        a.vy = (a.vy + fy) * .5
        a.x += a.vx
        a.y += a.vy

        if (false) {
            if (a.x <= 0) {
                a.x = cW + 10
            } 
            else if ( a.x > cW) {
                a.x = 0 - 10
            }
            if (a.y <= 0) {
                a.y = cH + 10
            } 
            else if ( a.y > cH) {
                a.y = 0 - 10
            }
        }
        else  {
            if (a.x <= RANDOM_START_BORDER_BUFFER) {
                a.vx = Math.abs(a.vx)
                // a.x = RANDOM_START_BORDER_BUFFER
            } 
            else if ( a.x >= cW - RANDOM_START_BORDER_BUFFER) {
                a.vx = -Math.abs(a.vx)
                // a.x = cW - RANDOM_START_BORDER_BUFFER
            }
            if (a.y <= RANDOM_START_BORDER_BUFFER) {
                a.vy = Math.abs(a.vy)
                // a.y = RANDOM_START_BORDER_BUFFER
            }
            else if (a.y >= cH - RANDOM_START_BORDER_BUFFER) {
                a.vy = -Math.abs(a.vy)
                // a.y = cH - RANDOM_START_BORDER_BUFFER
            }
        } 
        // console.log(a.vx)
        
    }
}


function updateRule(p1, p2, g) {
    for (let i = 0; i < p1.length; i++) {
        a = p1[i]
        
    }
}

function drawRectangle(x,y,c,s) {
    ctxf.fillStyle = colors[c];
    ctxf.fillRect(x,y,s,s);
}

function createParticle(x,y,c) {
    return {"x":x, "y":y, "vx":0, "vy":0, "c":c}
}

function randomLoc() {
    // Picks a random location on screen with a buffer
    // let randomX = (Math.random() * (cW - (RANDOM_START_BORDER_BUFFER)) + (RANDOM_START_BORDER_BUFFER / 2)) 
    // let randomY = (Math.random() * (cH - (RANDOM_START_BORDER_BUFFER)) + (RANDOM_START_BORDER_BUFFER / 2)) 
    // return [randomX, randomY]

    //random location
    return [Math.random() * cW, Math.random() * cH]
}

function createGroup(number, color) {
    let group = []
    for (let i = 0; i < number; i++) {
        let randLoc = randomLoc()
        group.push(createParticle(randLoc[0],randLoc[1],color))
        particles.push(group[i])
    }
    return group
}





//----------------------------------------------------------------------------------------------------
//   M A I N 
//----------------------------------------------------------------------------------------------------
function main() {
    ctxf = $$getCanvasContextWithID(CAN_ID_F);
    ctxb = $$getCanvasContextWithID(CAN_ID_B);

    particles = [];
    pList[1] = createGroup(Math.floor(Math.random() * 500), 1);
    pList[2] = createGroup(Math.floor(Math.random() * 500), 2);
    pList[3] = createGroup(Math.floor(Math.random() * 500), 3);
    pList[4] = createGroup(Math.floor(Math.random() * 500), 4);
    pList[5] = createGroup(Math.floor(Math.random() * 500), 5);
   


    setupColors()
    
    // createButton(10,100,50,100,"red","","Red Button",16,bCRed,bHRed,defaultRemoveHover)

    // for (let i = 0; i <= 50; i++) {
    //     createButton(Math.random() * cW,Math.random() * cH,(Math.random() * 50) + 70,(Math.random() * 20) + 30,"",IMG_BUTTON,"IMG",16,bCRed,defaultHover,defaultRemoveHover)
    // }

    window.requestAnimationFrame(gameLoop);
}


//----------------------------------------------------------------------------------------------------
//   Sliders
//----------------------------------------------------------------------------------------------------

// Move Slider
 for (let i = 1; i <= 25; i++) {
    document.getElementById("slide" + i).oninput = function(){
        document.getElementById("inp" + i).value = document.getElementById("slide" + i).value
        forces[i] = document.getElementById("slide" + i).value
    }
     
 }

 // mouse force
 document.getElementById("slide100").oninput = function(){
    document.getElementById("inp100").value = document.getElementById("slide100").value
    mouseForce = document.getElementById("slide100").value
}


 function recenter(slider) {
    if (slider == 100) {
        document.getElementById("slide100").value = 0
        document.getElementById("inp100").value = 0
        mouseForce = 0
        return
    }


    document.getElementById("slide" + slider).value = 0
    document.getElementById("inp" + slider).value = 0
    forces[slider] = 0
 }

 function inpChange(change) {
    let val = document.getElementById("inp" + change).value 
    document.getElementById("slide" + change).value = val
    forces[change] = val
 }



document.getElementById("cs1").addEventListener("change", watchColorPicker1, false);
function watchColorPicker1(event) {
    updateColor(1)
}
document.getElementById("cs2").addEventListener("change", watchColorPicker2, false);
function watchColorPicker2(event) {
    updateColor(2)
}
document.getElementById("cs3").addEventListener("change", watchColorPicker3, false);
function watchColorPicker3(event) {
    updateColor(3)
}
document.getElementById("cs4").addEventListener("change", watchColorPicker4, false);
function watchColorPicker4(event) {
    updateColor(4)
}
document.getElementById("cs5").addEventListener("change", watchColorPicker5, false);
function watchColorPicker5(event) {
    updateColor(5)
}

function updateColor(colorTag) {
    colors[colorTag] = document.getElementById("cs" + colorTag).value 
    let temp = document.getElementsByClassName("c" + colorTag);
    for(let item of temp) {
        item.style.backgroundColor = colors[colorTag]
    }

}

function setupColors() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById("cs" + i).value = colors[i]
        updateColor(i)
    }
}

function randomForces() {
    for (let i = 1; i <=25; i++) {
        if (Math.random() < .5) {
            forces[i] = (Math.random() - .5)  * 3
            document.getElementById("slide" + i).value = forces[i]
            document.getElementById("inp" + i).value = Math.round(forces[i] * 10) / 10
        }
        
    }
}

randomForces()


window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
  
    if (event.key == "a") {
        mouseActive = true
    }
})

window.addEventListener("keyup", (event) => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
  
    if (event.key == "a") {
        mouseActive = false
    }
})