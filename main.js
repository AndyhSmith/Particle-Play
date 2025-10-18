// main.js

const mouseParticle = { x: 0, y: 0, vx: 0, vy: 0, c: 1 };

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
    let scale = 0.1;
    let xAmount = scale * buttons[i].w;
    let yAmount = scale * buttons[i].h;
    buttons[i].x = buttons[i].xF - xAmount;
    buttons[i].w = buttons[i].wF + xAmount * 2;
    buttons[i].y = buttons[i].yF - yAmount;
    buttons[i].h = buttons[i].hF + yAmount * 2;
    buttons[i].ts = buttons[i].tsF + scale * buttons[i].h * 0.8;
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
        if (checkCollisionPoint(buttons[i], mouseDownX, mouseDownY)) {
            buttons[i].handleClick();
        }
    }
}

function handleMouseMove() {
    if (handleMouseMove) {
        let hovering = false;
        for (let i in buttons) {
            if (checkCollisionPoint(buttons[i], mouseX, mouseY)) {
                hovering = true;
                buttons[i].handleHover(i);
            } else {
                if (buttons[i].removeHover != undefined) {
                    buttons[i].removeHover(i);
                }
            }
        }
        if (hovering) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
    }
}

//----------------------------------------------------------------------------------------------------
//   D R A W I N G
//----------------------------------------------------------------------------------------------------
// Draw Foreground
function drawFront() {
    ctxf.clearRect(0, 0, cW, cH);

    // Batch draw by color to reduce state churn & calls
    for (let colorId = 1; colorId <= 5; colorId++) {
        const list = pList[colorId];
        if (!list) continue;
        ctxf.fillStyle = colors[colorId];
        for (let i = 0; i < list.length; i++) {
            const p = list[i];
            ctxf.fillRect(p.x, p.y, PARTICLE_SIZE, PARTICLE_SIZE);
        }
    }

    drawFPS();
}

// Draw Background
function drawBack() {}

//----------------------------------------------------------------------------------------------------
//   U P D A T E
//----------------------------------------------------------------------------------------------------

// yellow = createGroup(400, "yellow");
// red = createGroup(400, "red");
// green = createGroup(200, "green");
function dragonFly() {
    rule(green, green, -0.16);
    rule(green, red, -0.08);
    rule(green, yellow, 0.17);
    rule(red, red, -0.05);
    rule(red, green, -0.18);
    rule(yellow, yellow, 0.08);
    rule(yellow, green, -0.1);
}
function greenAtom() {
    rule(red, red, 0.1);
    rule(red, yellow, 0.15);
    rule(green, green, -0.7);
    rule(green, red, -0.2);
    rule(red, green, -0.1);
}

function unstableParticle() {
    rule(green, green, -0.9);
    rule(green, red, -0.08);
    rule(green, yellow, 0.17);
    rule(red, red, -0.05);
    rule(red, green, -0.18);
    rule(yellow, yellow, 0.08);
    rule(yellow, green, -0.6);
}

function stableGrandParticle() {
    rule(green, green, -2);
    rule(green, red, -0.08);
    rule(green, yellow, 0.17);
    rule(red, red, -0.05);
    rule(red, green, -0.18);
    rule(yellow, yellow, 0.08);
    rule(yellow, green, -0.6);
}

function simpleBlue() {
    rule(green, green, -2);
    rule(green, red, -0.08);
    rule(green, yellow, 0.17);
    rule(red, red, -0.05);
    rule(red, green, -0.18);
    rule(yellow, yellow, 0.08);
    rule(yellow, green, -0.6);
    rule(red, blue, 0.5);
    rule(blue, blue, 0.1);
    rule(blue, red, 0.5);
}

function deannaRule() {
    rule(green, blue, -1);
    rule(blue, green, 1);
    rule(yellow, yellow, 0.001);
    rule(red, yellow, -0.8);
    rule(yellow, green, 0.6);
    rule(red, red, 0.3);
    rule(blue, blue, 0.1);
}


// ADD: build a grid for a single color group
function buildGridForGroup(group, cellSize) {
  const grid = new Map(); // key: "cx|cy" -> array of particle refs
  const inv = 1 / cellSize;
  for (let i = 0; i < group.length; i++) {
    const p = group[i];
    const cx = (p.x * inv) | 0;
    const cy = (p.y * inv) | 0;
    const key = cx + "|" + cy;
    let bucket = grid.get(key);
    if (!bucket) {
      bucket = [];
      grid.set(key, bucket);
    }
    bucket.push(p);
  }
  return grid;
}

// ADD: build all grids once per frame
function buildAllGrids(cellSize) {
  spatial.cellSize = cellSize;
  spatial.grids[1] = buildGridForGroup(pList[1], cellSize);
  spatial.grids[2] = buildGridForGroup(pList[2], cellSize);
  spatial.grids[3] = buildGridForGroup(pList[3], cellSize);
  spatial.grids[4] = buildGridForGroup(pList[4], cellSize);
  spatial.grids[5] = buildGridForGroup(pList[5], cellSize);
}

// ADD: iterate neighbors of (x,y) in the 3x3 surrounding cells of groupId
function forEachNeighbor(groupId, x, y, fn) {
  const grid = spatial.grids[groupId];
  if (!grid) return;
  const cs = spatial.cellSize, inv = 1 / cs;
  const cx = (x * inv) | 0, cy = (y * inv) | 0;
  for (let gy = cy - 1; gy <= cy + 1; gy++) {
    for (let gx = cx - 1; gx <= cx + 1; gx++) {
      const bucket = grid.get(gx + "|" + gy);
      if (!bucket) continue;
      for (let i = 0; i < bucket.length; i++) fn(bucket[i]);
    }
  }
}


function update() {
    // Prepare mouse particle without allocating arrays every frame
    mouseParticle.x = mouseX;
    mouseParticle.y = mouseY;

    // Build spatial grids once per frame based on your interaction radius
    const R = cW / CELL_SIZE;        // your current cutoff radius
    buildAllGrids(R);

    // Run rules using spatial queries (no O(n^2) over full lists)
    for (let i = 0; i < 25; i++) {
        const aId = particleIndex[i][0];
        const bId = particleIndex[i][1];
        const g   = forces[i + 1];
        if (g !== 0) rule(pList[aId], bId, g, R);
        if (mouseActive) rule(pList[aId], /*bId=*/100, mouseForce, R); // 100 = special mouse group
    }
}

function gameLoop() {
    if (backgroundChanged) {
        drawBack();
    }
    calcFPS();
    update();
    drawFront();
    window.requestAnimationFrame(gameLoop);
}

//----------------------------------------------------------------------------------------------------
//   P A R T I C L E S
//----------------------------------------------------------------------------------------------------

// ADD: reuse (no per-frame allocations)
// const mouseParticle = createParticle(0, 0, 1);

function rule(p1, p2Id, g, R) {
    const R2 = R * R;             // compare squared distance
    const cs = spatial.cellSize;
    const invR = 1 / R;           // rough scale if you want, optional

    // mouse as "group 100"
    const useMouse = (p2Id === 100);

    for (let i = 0; i < p1.length; i++) {
        const a = p1[i];
        let fx = 0, fy = 0;

        if (useMouse) {
            const b = mouseParticle;
            let dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > 0 && d2 < R2) {
                const invd = 1 / Math.sqrt(d2);
                const F = (-g) * invd; // original code uses g = -g
                fx += F * dx;
                fy += F * dy;
            }
        } else {
            // Iterate only neighbors from spatial grid
            forEachNeighbor(p2Id, a.x, a.y, (b) => {
                // Skip self when p1 === p2
                if (a === b) return;
                let dx = a.x - b.x, dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > 0 && d2 < R2) {
                    const invd = 1 / Math.sqrt(d2);
                    const F = (-g) * invd;
                    fx += F * dx;
                    fy += F * dy;
                }
            });
        }

        a.vx = (a.vx + fx) * 0.5;
        a.vy = (a.vy + fy) * 0.5;
        a.x += a.vx;
        a.y += a.vy;

        // wall bounces as before
        if (a.x <= RANDOM_START_BORDER_BUFFER) {
            a.vx = Math.abs(a.vx);
        } else if (a.x >= cW - RANDOM_START_BORDER_BUFFER) {
            a.vx = -Math.abs(a.vx);
        }
        if (a.y <= RANDOM_START_BORDER_BUFFER) {
            a.vy = Math.abs(a.vy);
        } else if (a.y >= cH - RANDOM_START_BORDER_BUFFER) {
            a.vy = -Math.abs(a.vy);
        }
    }
}






// function updateRule(p1, p2, g) {
//     for (let i = 0; i < p1.length; i++) {
//         a = p1[i];
//     }
// }

function drawRectangle(x, y, c, s) {
    ctxf.fillStyle = colors[c];
    ctxf.fillRect(x, y, s, s);
}

function createParticle(x, y, c) {
    return { x: x, y: y, vx: 0, vy: 0, c: c };
}

function randomLoc() {
    // Picks a random location on screen with a buffer
    // let randomX = (Math.random() * (cW - (RANDOM_START_BORDER_BUFFER)) + (RANDOM_START_BORDER_BUFFER / 2))
    // let randomY = (Math.random() * (cH - (RANDOM_START_BORDER_BUFFER)) + (RANDOM_START_BORDER_BUFFER / 2))
    // return [randomX, randomY]

    //random location
    return [Math.random() * cW, Math.random() * cH];
}

function createGroup(number, color) {
    let group = [];
    for (let i = 0; i < number; i++) {
        let randLoc = randomLoc();
        group.push(createParticle(randLoc[0], randLoc[1], color));
        particles.push(group[i]);
    }
    return group;
}

//----------------------------------------------------------------------------------------------------
//   M A I N
//----------------------------------------------------------------------------------------------------
function main() {
    ctxf = $$getCanvasContextWithID(CAN_ID_F);
    ctxb = $$getCanvasContextWithID(CAN_ID_B);

    setUpParticles();

    window.requestAnimationFrame(gameLoop);
}

function setUpParticles() {
    particles = [];
    pList = [];
    pList[1] = createGroup(PARTICLES_PER_GROUP, 1);
    pList[2] = createGroup(PARTICLES_PER_GROUP, 2);
    pList[3] = createGroup(PARTICLES_PER_GROUP, 3);
    pList[4] = createGroup(PARTICLES_PER_GROUP, 4);
    pList[5] = createGroup(PARTICLES_PER_GROUP, 5);

    setupColors();
}

//----------------------------------------------------------------------------------------------------
//   Sliders
//----------------------------------------------------------------------------------------------------

// Move Slider
for (let i = 1; i <= 25; i++) {
    document.getElementById("slide" + i).oninput = function () {
        document.getElementById("inp" + i).value = document.getElementById("slide" + i).value;
        forces[i] = document.getElementById("slide" + i).value;
    };
}

// mouse force
document.getElementById("slide100").oninput = function () {
    document.getElementById("inp100").value = document.getElementById("slide100").value;
    mouseForce = document.getElementById("slide100").value;
};





// Particles-per-color slider
document.getElementById("slideCount").oninput = function () {
    document.getElementById("inpCount").value = this.value;
    PARTICLES_PER_GROUP = parseInt(this.value) || 0;
    setUpParticles();
};
function countInpChange() {
    let v = parseInt(document.getElementById("inpCount").value) || 0;
    document.getElementById("slideCount").value = v;
    PARTICLES_PER_GROUP = v;
    setUpParticles();
}

// Particle size slider
document.getElementById("slideSize").oninput = function () {
    document.getElementById("inpSize").value = this.value;
    PARTICLE_SIZE = parseInt(this.value) || 1;
};
function sizeInpChange() {
    let v = parseInt(document.getElementById("inpSize").value) || 1;
    document.getElementById("slideSize").value = v;
    PARTICLE_SIZE = v;
}






function recenter(slider) {
    if (slider == 100) {
        document.getElementById("slide100").value = 0;
        document.getElementById("inp100").value = 0;
        mouseForce = 0;
        return;
    }

    document.getElementById("slide" + slider).value = 0;
    document.getElementById("inp" + slider).value = 0;
    forces[slider] = 0;
}

function inpChange(change) {
    let val = document.getElementById("inp" + change).value;
    document.getElementById("slide" + change).value = val;
    forces[change] = val;
}

document.getElementById("cs1").addEventListener("change", watchColorPicker1, false);
function watchColorPicker1(event) {
    updateColor(1);
}
document.getElementById("cs2").addEventListener("change", watchColorPicker2, false);
function watchColorPicker2(event) {
    updateColor(2);
}
document.getElementById("cs3").addEventListener("change", watchColorPicker3, false);
function watchColorPicker3(event) {
    updateColor(3);
}
document.getElementById("cs4").addEventListener("change", watchColorPicker4, false);
function watchColorPicker4(event) {
    updateColor(4);
}
document.getElementById("cs5").addEventListener("change", watchColorPicker5, false);
function watchColorPicker5(event) {
    updateColor(5);
}

function updateColor(colorTag) {
    colors[colorTag] = document.getElementById("cs" + colorTag).value;
    let temp = document.getElementsByClassName("c" + colorTag);
    for (let item of temp) {
        item.style.backgroundColor = colors[colorTag];
    }
}

function setupColors() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById("cs" + i).value = colors[i];
        updateColor(i);
    }
}

function randomForces() {
    for (let i = 1; i <= 25; i++) {
        document.getElementById("slide" + i).value = 0;
        document.getElementById("inp" + i).value = 0;
    }
    for (let i = 1; i <= 25; i++) {
        if (Math.random() < 0.5) {
            forces[i] = (Math.random() - 0.5) * 3;
            document.getElementById("slide" + i).value = forces[i];
            document.getElementById("inp" + i).value = Math.round(forces[i] * 10) / 10;
        }
    }
    setUpParticles();
}

randomForces();

window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (event.key == "a") {
        mouseActive = true;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    if (event.key == "a") {
        mouseActive = false;
    }
});

//----------------------------------------------------------------------------------------------------
//   Hide Show Settings
//----------------------------------------------------------------------------------------------------

let settings1 = 0;
function toggleSettings() {
    if (settings1) {
        document.getElementById("settings1").style.display = "none";
        settings1 = 0;
    } else {
        document.getElementById("settings1").style.display = "block";
        settings1 = 1;
    }
    // document.getElementById("settings1").style.display = "none";
}


