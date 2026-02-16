let canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#ffb3b3";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let text = document.getElementById("text1");
let text2 = document.getElementById("text2");
let cycle = 0;
let particles = [];
let lastX = -100;
let lastY = -100;
let dots = [];
let bombs = [];
let lastTime = 0;

function explode(x, y, color, times){
    for(let i=0; i<times; i++){
        let xvelocity = Math.random()*4-2;
        let yvelocity = Math.random()*4-2;
        particles.push({"x":x,"y":y, "xvelo":xvelocity, "yvelo":yvelocity, "color":color, "fade":255});
    }
}

function bomb(x, y, size){
    bombs.push({"x":x,"y":y, "size":size, "fade":155});
}

canvas.onclick = function(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX-rect.left;
    let mouseY = event.clientY-rect.top;

    let rand = (Math.floor(Math.random() * 155)+100).toString(16).padStart(2, "0");
    let rand2 = (Math.floor(Math.random() * 155)+100).toString(16).padStart(2, "0");
    let rand3 = (Math.floor(Math.random() * 155)+100).toString(16).padStart(2, "0");
    let rand4 = Math.round(Math.random() * 600);
    let xvelocity = (mouseX-rand4)/60;
    let yvelocity = (mouseY-400)/60;
    dots.push({"targetx":mouseX,"targety":mouseY,
        "x":rand4, "y":400, "xvelo":xvelocity, "yvelo":yvelocity,
        "color":"#"+rand+rand2+rand3, "time":0});
    
};

canvas.onmousemove = function(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX-rect.left;
    let mouseY = event.clientY-rect.top;
    lastX = mouseX;
    lastY = mouseY;
};

canvas.onmouseleave = function() {
    lastX = -100;
    lastY = -100;
};

function pow() {
    let rand = (Math.floor(Math.random() * 155)+100).toString(16).padStart(2, "0");
    let rand2 = (Math.floor(Math.random() * 155)+100).toString(16).padStart(2, "0");
    let rand3 = (Math.floor(Math.random() * 155)+100).toString(16).padStart(2, "0");
    text.innerHTML = `Mouse last at x:${lastX}, y:${lastY}`;

    explode(lastX, lastY, "#"+rand+rand2+rand3, 3);
}

function animate(time) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffb3b3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width/2, (canvas.height/2)+Math.sin(cycle)*5);

    ctx.fillStyle = "#e73535";
    ctx.beginPath();
    ctx.arc(-50, -20, 50, -Math.PI, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(50, -20, 50, -Math.PI, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, -20);
    ctx.bezierCurveTo(100, 20, 50, 80, 0, 100);
    ctx.lineTo(0, -20);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-100, -20);
    ctx.bezierCurveTo(-100, 20, -50, 80, 0, 100);
    ctx.lineTo(0, -20);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(-40, 0, 10, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(-43, -5, 3, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(40, 0, 10, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(37, -5, 3, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(0, 40, 15, 0, Math.PI);
    ctx.fill();

    ctx.restore();


    if(lastX > 0 && lastY > 0) pow();


    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FFFFFF";
    dots.forEach(function(dot){
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 7, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = dot.color;
        ctx.fill();
    });
    ctx.lineWidth = 0;

    dots = dots.filter(dot => {
        dot.time += (time-lastTime)/60;
        dot.x += dot.xvelo;
        dot.y += dot.yvelo;
        if(!(dot.y>dot.targety)){
            explode(dot.x, dot.y, dot.color, 50);
            bomb(dot.x, dot.y, 20);
        }
        return dot.y > dot.targety;
    });

    text2.innerHTML = `Particle number: ${particles.length}`;

    particles.forEach(function(part){
        ctx.beginPath();
        ctx.arc(part.x, part.y, 5, 0, 2*Math.PI);
        ctx.fillStyle = part.color+part.fade.toString(16).padStart(2, "0");
        ctx.fill();
    });

    particles = particles.filter(part => {
        part.x += part.xvelo;
        part.y += part.yvelo;
        part.fade -= 3;
        return part.fade > 10;
    });

    bombs.forEach(function(bomb){
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, bomb.size, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
    });

    bombs = bombs.filter(part => {
        part.size += 10;
        part.fade -= 30;
        return part.fade > 10;
    });

    cycle = (cycle + Math.PI/30);
    requestAnimationFrame(animate);
}

animate();