function $$getCanvasContextWithID(canvasID) {
    let c = document.getElementById(canvasID);
    c.width = document.body.clientWidth; 
    c.height = document.body.clientHeight; 
    let ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return ctx;
}



//----------------------------------------------------------------------------------------------------
//   P A G E   R E S I Z E
//----------------------------------------------------------------------------------------------------
function resizeHelper(canvasID) {
    let c = document.getElementById(canvasID);
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight; 
}

function resize() {
    resizeHelper(CAN_ID_F)
    resizeHelper(CAN_ID_B)
    cW = document.body.clientWidth;
    cH = document.body.clientHeight; 
}

//----------------------------------------------------------------------------------------------------
//   B U T T O N S
//----------------------------------------------------------------------------------------------------
function createButton(xPos, yPos, width, height, color, img, text, textSize, hanClick, hanHover,remHover) {
    let newButton = {
        x: xPos, 
        y: yPos,
        w: width, 
        h: height,
        xF: xPos, 
        yF: yPos,
        wF: width, 
        hF: height,
        c: color,
        i: img,
        t: text,
        ts: textSize,
        tsF: textSize,
        handleClick: hanClick,
        handleHover: hanHover,
        removeHover: remHover,
    }
    buttons.push(newButton);
}

function drawButtons() {
    for (let i in buttons) {
        if (buttons[i].c != "") {
            ctxf.fillStyle = buttons[i].c
            ctxf.fillRect(buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h);
        }
        else if (buttons[i].img != "") {
            ctxf.drawImage(buttons[i].i, buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h)
        }

        if (buttons[i].t != "") {
            ctxf.fillStyle = "black"
            ctxf.textAlign = 'center';
            ctxf.font = buttons[i].ts + 'px pixel';
            ctxf.fillText(buttons[i].t, buttons[i].x + (buttons[i].w / 2), buttons[i].y  + (buttons[i].h / 2) + (buttons[i].ts / 3));
        }
    }
}


//----------------------------------------------------------------------------------------------------
//   C O L L I S I O N S
//----------------------------------------------------------------------------------------------------
function checkCollisionRect(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y) {
         return true;
    }
    return false;
}

function checkCollisionPoint(rect, xPos, yPos) {
    if (xPos > rect.x && xPos < rect.x + rect.w &&
        yPos > rect.y && yPos < rect.y + rect.h) {
            return true;
    }
    return false;
}


//----------------------------------------------------------------------------------------------------
//   M O U S E   &   T O U C H
//----------------------------------------------------------------------------------------------------
function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    onStartClick(firstTouch)                                    
};    
function onStartClick(event) {
    mouseDownX = event.clientX;                                      
    mouseDownY = event.clientY; 
    handleClick()
}

  
function handleTouchMove(evt) {
    handleMove(evt.touches[0])                                         
};
function handleMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    handleMouseMove()
}


//----------------------------------------------------------------------------------------------------
//   F P S 
//----------------------------------------------------------------------------------------------------
function drawFPS() {
    if (fpsShow) {
        ctxf.fillStyle = "black"
        ctxf.textAlign = 'right';
        ctxf.font = '16px sans-serif';
        ctxf.fillText("FPS:" + fps, cW - 20, 20);
    }
}

function calcFPS() {
    if (fpsShow){
        fpsCounter++;
        if (fpsCounter % 20 == 0) {
            fpsOldDate = fpsNewDate;
            fpsNewDate = Date.now();
            fps = (20000 / (fpsNewDate - fpsOldDate)).toFixed(0);
        }
    }
}