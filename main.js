

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
    //dragonFly()
    // unstableParticle()
    // stableGrandParticle()
    // simpleBlue()
    deannaRule()
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
    for (let i = 0; i < p1.length; i++) {
        let fx = 0;
        let fy = 0;
        let a = null;
        let b = null;
        for (let j = 0; j < p2.length; j++) {
            a = p1[i]
            b = p2[j]
            let dx = a.x-b.x;
            let dy = a.y - b.y;
            let d = Math.sqrt(dx*dx + dy*dy);
            if (d > 0 && d < cW / 5) {
                let F = g * 1 / d
                fx += (F * dx)
                fy += (F * dy)
            }
            
        }
        a.vx = (a.vx + fx) * .5
        a.vy = (a.vy + fy) * .5
        a.x += a.vx
        a.y += a.vy

        if (a.x <= RANDOM_START_BORDER_BUFFER) {
            a.vx = Math.abs(a.vx)
        } 
        else if ( a.x >= cW - RANDOM_START_BORDER_BUFFER) {
            a.vx = -Math.abs(a.vx)
        }
        if (a.y <= RANDOM_START_BORDER_BUFFER) {
            a.vy = Math.abs(a.vy)
        }
        else if (a.y >= cH - RANDOM_START_BORDER_BUFFER) {
            a.vy = -Math.abs(a.vy)
        }
        
    }
}

function drawRectangle(x,y,c,s) {
    ctxf.fillStyle = c;
    ctxf.fillRect(x,y,s,s);
}

function createParticle(x,y,c) {
    return {"x":x, "y":y, "vx":0, "vy":0, "c":c}
}

function randomLoc() {
    // Picks a random location on screen with a buffer
    let randomX = (Math.random() * (cW - (RANDOM_START_BORDER_BUFFER)) + (RANDOM_START_BORDER_BUFFER / 2)) 
    let randomY = (Math.random() * (cH - (RANDOM_START_BORDER_BUFFER)) + (RANDOM_START_BORDER_BUFFER / 2)) 
    return [randomX, randomY]
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
    yellow = createGroup(1000, "yellow");
    red = createGroup(400, "red");
    green = createGroup(200, "green");
    blue = createGroup(200, "blue");
    
    // createButton(10,100,50,100,"red","","Red Button",16,bCRed,bHRed,defaultRemoveHover)

    // for (let i = 0; i <= 50; i++) {
    //     createButton(Math.random() * cW,Math.random() * cH,(Math.random() * 50) + 70,(Math.random() * 20) + 30,"",IMG_BUTTON,"IMG",16,bCRed,defaultHover,defaultRemoveHover)
    // }

    window.requestAnimationFrame(gameLoop);
}



