const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
let score = 0;
let gameFrame = 0;

// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousemove', function(e){
    mouse.click = true;
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
window.addEventListener('mouseup', function(e){
    mouse.click = false;
});

// Player
const playerLeft = new Image();
playerLeft.src = '../img/kunai-left.png';
const playerRight = new Image();
playerRight.src = '../img/kunai-left.png';

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 160;
        this.spriteHeight = 105;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x){
            this.x -= dx/20;
            this.moving = true;
        }
        if (mouse.y != this.y){
            this.y -= dy/20;
            this.moving = true;
        }
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width) this.x = canvas.width;
        if (this.y < 50) this.y = 50;
        if (this.y > canvas.height) this.y = canvas.height;
        let theta = Math.atan2(dy,dx);
        this.angle = theta;
    }
    draw(){
        if (mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
 
            ctx.stroke();
        }
    
        ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth * 0.8, this.spriteHeight * 0.8);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth * 0.8, this.spriteHeight * 0.8);
        }
        ctx.restore();
    }
}
const player = new Player();

// chakras
const chakrasArray = [];
const chakras = new Image();
chakras.src = '../img/poder.png';
class Chakras {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = 0 - 50 - Math.random() * canvas.height/2;
        this.radius = 50;
        this.speed = Math.random() * -3 + -3;
        this.distance;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.counted = false;
        this.frameX = 0;
        this.spriteWidth = 91;
        this.spriteHeight = 91;
        this.pop = false;
        this.counted = false;
    }
    update(){
        this.y -= this.speed
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.drawImage(chakras, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - 68, this.y - 68, this.spriteWidth*1.5, this.spriteHeight*1.5);
    }
}
function handlechakras(){
    for (let i = 0; i < chakrasArray.length; i++){
        if (chakrasArray[i].y > canvas.height * 2){
            chakrasArray.splice(i, 1);
        }
    }
    for (let i = 0; i < chakrasArray.length; i++){
        if (chakrasArray[i].distance < chakrasArray[i].radius + player.radius){
            popAndRemove(i);
        }
    }
    for (let i = 0; i < chakrasArray.length; i++){
        chakrasArray[i].update();
        chakrasArray[i].draw();
    }
    if (gameFrame % 50 == 0) {
        chakrasArray.push(new Chakras());

    }
}
function popAndRemove(i){
    if (chakrasArray[i]) {
        if (!chakrasArray[i].counted) score++;
        chakrasArray[i].counted = true;
        chakrasArray[i].frameX++;
        if (chakrasArray[i].frameX > 7) chakrasArray[i].pop = true;
        if (chakrasArray[i].pop) chakrasArray.splice(i, 1);
        requestAnimationFrame(popAndRemove);
    }

}
const textCoordinates = ctx.getImageData(0, 0, 100, 100);
function init2() {
    chakrasTextArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                chakrasTextArray.push(new Particle2(positionX * 8, positionY * 8));
            }
        }
    }
}
init2();
console.log(chakrasTextArray);

// animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < chakrasTextArray.length; i++){
        chakrasTextArray[i].draw();
    }
    handlechakras();
    player.update();
    player.draw();
    gameFrame += 4;
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function(){
  canvasPosition = canvas.getBoundingClientRect();
  mouse.x = canvas.width/2;
  mouse.y = canvas.height/2;
});