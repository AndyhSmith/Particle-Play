

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
    drawButtons()
    drawFPS()
}

// Draw Background
function drawBack() { 

}

//----------------------------------------------------------------------------------------------------
//   U P D A T E
//----------------------------------------------------------------------------------------------------
function update() {

}

function gameLoop() {
    if (backgroundChanged) {drawBack()}
    calcFPS()
    update()
    drawFront()
    window.requestAnimationFrame(gameLoop);
}

//----------------------------------------------------------------------------------------------------
//   M A I N 
//----------------------------------------------------------------------------------------------------
function main() {
    ctxf = $$getCanvasContextWithID(CAN_ID_F);
    ctxb = $$getCanvasContextWithID(CAN_ID_B);
    
    createButton(10,100,50,100,"red","","Red Button",16,bCRed,bHRed,defaultRemoveHover)

    for (let i = 0; i <= 50; i++) {
        createButton(Math.random() * cW,Math.random() * cH,(Math.random() * 50) + 70,(Math.random() * 20) + 30,"",IMG_BUTTON,"IMG",16,bCRed,defaultHover,defaultRemoveHover)
    }

    window.requestAnimationFrame(gameLoop);
}








