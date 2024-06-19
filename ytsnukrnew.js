p5.disableFriendlyErrors = true;    // To help performance.
let prevPocketedBall = null;
const { Engine, World, Bodies } = Matter;

class Edge {
    
    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.wid = w;
        this.hid = h;
    }

    checkHit(_b){
        
        let newV = createVector();
        let eRad = 0;
        
        if (this.wid > this.hid){
            newV = createVector(_b.pos.x, this.pos.y);
            eRad = this.hid/2;
        }
        else {
            newV = createVector(this.pos.x, _b.pos.y);
            eRad = this.wid/2;
        }
        
        let dist = p5.Vector.sub(_b.pos, newV);
        dist = dist.mag();
        
        if (dist < _b.rad + eRad)
            return true;
        else
        return false;
    }
    
    render(){
        
        rectMode(CENTER);
        
        // Brown.
        fill(72,44,22);
        stroke(200);
        strokeWeight(2);
        
        rect(this.pos.x, this.pos.y, this.wid-15, this.hid-15);
    }
    
}

class Ball extends Edge {
    
    constructor(_x, _y, _dia){

        super (_x, _y, _dia);
        
        this.dia = tableHeight/36;
        this.rad = this.dia/2;
        this.vel = createVector();
        this.acc = createVector();
        
        
    }
    
    checkCol(_b){
        
        let dist = p5.Vector.sub(_b.pos, this.pos);
        let nDist = dist.mag();
        
        if (nDist <= _b.rad + this.rad){
            
            // Pauli exclusion!
            dist = dist.normalize();
            //_b.pos.add(dist.mult(2));
            this.pos.sub(dist.mult(0.1));
            
              let _dist = p5.Vector.sub(this.pos, _b.pos);
            _dist = _dist.normalize();
            
            let nV = createVector(-_dist.y, _dist.x);
            nV.normalize();
            
            let vStore = _b.vel.mag();
            
            this.vel.mult(0.9);
            _b.vel.mult(0.75);
            
            this.acc.add(_dist.mult(0.5*vStore));
            _b.acc.add(-nV.mult(0.5*vStore));
        
        }
        
        
    }
    
    render(){

        fill(0);
        stroke(255,101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
         
    }
    
    move(){
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        
        // Deceleration.
        if (this.vel.mag() > 0.02)
        this.vel.mult(0.99);
        else {this.vel.x = 0; this.vel.y = 0;}
        
        this.acc.mult(0);
        
    }
    
    
}
class redBall extends Ball {
    constructor(_x, _y, _dia){
        super(_x, _y, _dia);
    }
    
    render(){
        //red
        fill(255,0,0);
        stroke(255,101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}

class yellowBall extends Ball {
    constructor(_x, _y, _dia){
        super(_x, _y, _dia);
    }
    
    render(){
        
        // Yellow.
        fill(255,255,0);
        stroke(255,101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}
class greenBall extends Ball {
    constructor(_x, _y, _dia){
        super(_x, _y, _dia);
    }
    
    render(){
    
        //green
        fill(0, 255, 0);
        stroke(255,101);
        strokeWeight(1); 
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}
class brownBall extends Ball {
    constructor(_x, _y, _dia){
        super(_x, _y, _dia);
    }
    
    render(){

        //brown
        fill(165, 42, 42);
        stroke(255,101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}
class blueBall extends Ball {
    constructor(_x, _y, _dia){
        super(_x, _y, _dia);
    }
    
    render(){
  
        //blue
        fill(0, 0, 255);
        stroke(255,101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}
class pinkBall extends Ball {
    constructor(_x, _y, _dia){
        super(_x, _y, _dia);
    }
    
    render(){
 
        //pink
        fill(255,0,200);
        stroke(255,101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}
class blackBall extends Ball {
    constructor(_x, _y, _dia){
        super(_x, _y, _dia);
    }
    
    render(){
      
        //black
        fill(0);
        stroke(255,101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}
class Pocket extends Edge {
    
    constructor(_x, _y){
        super (_x, _y);
        this.wid = (tableHeight/36)*1.5;
        this.hue = 0;
    }
    
     render(){
        
        this.hue += Math.sin(frameCount/255);
        if (this.hue > 255) this.hue = 255;
        if (this.hue < 0) this.hue = 0;
        fill(this.hue);
        stroke(0,147,0);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.wid, this.wid);
    
    }
    
    checkSink(_b){
        
        let dist = p5.Vector.sub(_b.pos, this.pos);
        dist = dist.mag();
        
        if (dist < _b.rad + this.wid/2)
            return true;
        else return false;
        
        
    }
    
}

class Cue extends Edge {
    constructor(){
        super(mouseX, mouseY, 32);
    }
    
    update(_sunk){
        this.pos.x = mouseX;
        this.pos.y = mouseY;
        
        this.tip = createVector(0,0);
        
        // We want the cue to always
        // point towards the cue ball.
        // (remember to think about 'cueIsSunk' condition).
        // 
        // So, we need to draw a vector from mouse position to cue ball, and then draw a cue according to that vector. This could be done with a line with some thick strokeWeight? Or, we could rotate a rectangle.
        
        // Let's try the line thing first!
        
        // Also, we don't want mousePos to be tip of cue, but centre point.
        
        if (!_sunk){
            let toCB = createVector(0,0);
            let wmbi = createVector(0,0);
            let wtpi = createVector(0,0);
            wmbi.x = balls[0].pos.x;
            wmbi.y = balls[0].pos.y;
            wtpi.x = mouseX;
            wtpi.y = mouseY;
            toCB = p5.Vector.sub(wmbi, wtpi);
            
            toCB = toCB.normalize();
            let backCB = createVector(toCB.x, toCB.y);
            stroke(200,101,0);
            strokeWeight(9);
            let l1 = createVector(wtpi.x, wtpi.y);
            l1 = l1.add(toCB.mult(100));
            let l2 = createVector(wtpi.x, wtpi.y); 
            l2 = l2.sub(backCB.mult(280));
          
            line(l1.x,l1.y,l2.x,l2.y);
            stroke(200);
            strokeWeight(11);
            point(l1.x,l1.y);
            this.tip.x = l1.x;
            this.tip.y = l1.y;
        }
        
    }
    
    render(){
        if (cueActive)
        fill(0,0,255,142);
        else
        fill(255,101);
        stroke(255);
        strokeWeight(2);
        
      
        ellipse(this.pos.x, this.pos.y, this.wid, this.wid);
    }
    
    checkStrike(_b){
        
        if (cueBsunk){
        let dist = p5.Vector.sub(_b.pos, this.pos);
        let mDist = dist.mag();
        
        if (mDist < _b.rad + (this.wid/2)){
    
            _b.acc = dist.mult(0.1);
        }
        }
        else if (!cueBsunk){
            let dist = p5.Vector.sub(_b.pos, this.tip);
            let mDist = dist.mag();
        
        if (mDist < _b.rad + 9){
            
             // Pauli exclusion!
            dist = dist.normalize();
            _b.acc = dist.mult(3.14);
        }
        }
        
    }
}


class CueBall extends Ball {
    constructor(_diameter){
        super ();
        this.pos.x = width/2 - 350;
        this.pos.y = height/2 + 60;
        
        this.dia = tableHeight/36;
        this.rad = this.dia/2;
    }
    
    render(){
        fill(255);
        stroke(0);
        strokeWeight(1);
        
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
    
}


//   BILLIARDS / SNOOKER

// p5.js library 


let engine;
let tableWidth = 1500;  // Adjust to the desired width
let tableHeight = 750;  // Adjust to twice the width

var topEdge;

var balls = [];

var pockets = [];

var cueActive = false;  // Drag mouse/finger to activate cue-tip.
var cue;
var cueBsunk = false;   // Is the cueBall sunk?
                        // If so, allow collision between cue and *all* balls.

function setup(){
    
    createCanvas(tableWidth, tableHeight);
    
    background(0,101,202);  
    
    // Edges.
    topEdge = new Edge(tableWidth / 2, tableHeight / 8, tableWidth * 0.75, 32);
    botEdge = new Edge(tableWidth / 2, tableHeight - tableHeight / 8, tableWidth * 0.75, 32);
    leftEdge = new Edge(tableWidth / 8, tableHeight / 2, 32, botEdge.pos.y - topEdge.pos.y);
    rightEdge = new Edge(tableWidth - tableWidth / 8, tableHeight / 2, 32, botEdge.pos.y - topEdge.pos.y);
    

    setupBalls();
    
    setupPockets();
    
    cue = new Cue();

    engine = Engine.create();
    World.add(engine.world, [/* Add bodies if needed */]);

} 
function displayTimedMessage(message, duration) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;

    // Clear the message after the specified duration (in milliseconds)
    setTimeout(() => {
        messageElement.textContent = '';
    }, duration);
}
let redBallsCount = 15 ;

function draw(){
    
    Engine.update(engine);
    
    background(0,101,202);

    noStroke();
    fill(255);
    text("Hold button to activate cue tip.", 32,32);
    
    // Draw green baize.
    fill(0,122,0);
    //noStroke();
    rect(width/2,height/2,topEdge.wid, leftEdge.hid);
    
    topEdge.render();
    botEdge.render();
    leftEdge.render();
    rightEdge.render();
    // Draw a white verticle line
    stroke(255);
    strokeWeight(2);
    line(tableHeight/2 +50 ,topEdge.pos.y+9 , tableHeight/2 +50, topEdge.pos.y+552) ;
    
    // Draw a hollow hemisphere with a circle around the line
    let centerX = tableHeight/2 +50;
    let centerY = height / 2;
    let outerRadius = 90;
    
    // Draw the outer hemisphere using the arc function
    noFill(); // No fill for the outer hemisphere
    stroke(255); // White color for the stroke
    arc(centerX, centerY, outerRadius * 2, outerRadius * 2, 3.14 / 2, -3.14 / 2);
    for (let i = balls.length-1; i >= 0; i--){
        
        // Balls colliding with cue?
        if ((cueActive && balls[i] instanceof CueBall) || cueBsunk)
        cue.checkStrike(balls[i]);
    
        // Balls colliding with each other.
        for (let j = 0; j < balls.length; j++){
            if (i !== j){
                balls[i].checkCol(balls[j]);
            }
        }
        
        // Balls colliding with edges.
        if (topEdge.checkHit(balls[i]) ||
        botEdge.checkHit(balls[i]) === true){
            balls[i].vel.y = -balls[i].vel.y;
        }
        if (leftEdge.checkHit(balls[i]) ||
        rightEdge.checkHit(balls[i]) === true){
            balls[i].vel.x = -balls[i].vel.x;
        }
        
        // Draw balls, and their physics.
        balls[i].render();
        balls[i].move();
        
        // Pocket collisions.
        var sunk = false;
        for (let k = 0; k < pockets.length; k++){
            if (pockets[k].checkSink(balls[i])){
                if (balls[i] instanceof CueBall){
                    displayTimedMessage("Cue ball pocketed.", 2000);
                    cueBallSunk();
                }
                else {
                    // Check for consecutive colored balls being pocketed
                    if (prevPocketedBall instanceof Ball && balls[i] instanceof Ball) {
                        // Compare the types of previously pocketed ball and the current ball
                        if (prevPocketedBall.constructor.name !== balls[i].constructor.name) {
                            //no foul occuring
                        }else {
                            displayTimedMessage("Mistake:Same type of colored balls pocketed consecutively.", 2000);
                        }
                    }
                // Update prevPocketedBall to the current ball being pocketed
                prevPocketedBall = balls[i];
                //red
                if(balls[i] instanceof redBall){
                    balls.splice(i, 1);
                    redBallsCount-- ;
                }
                //yellow
                else if(balls[i] instanceof yellowBall){
                    if(redBallsCount > 0){
                        balls[i].pos.x = tableHeight/2 +50;
                        balls[i].pos.y = tableHeight/2+90;
                        balls[i].vel.mult(0); // Reset velocity to stop any residual motion
                    }
                    else{
                        balls.splice(i, 1);
                    }
                }
                //green
                else if(balls[i] instanceof greenBall){
                    if(redBallsCount > 0){
                        balls[i].pos.x = tableHeight/2 +50;
                        balls[i].pos.y = tableHeight/2-90;
                        balls[i].vel.mult(0); // Reset velocity to stop any residual motion
                    }
                    else{
                        balls.splice(i, 1);
                    }
                }
                //brown
                else if(balls[i] instanceof brownBall){
                    if(redBallsCount > 0){
                        balls[i].pos.x = tableHeight/2 +50;
                        balls[i].pos.y = tableHeight/2;
                        balls[i].vel.mult(0); // Reset velocity to stop any residual motion
                    }
                    else{
                        balls.splice(i, 1);
                    }
                }
                //blue
                else if(balls[i] instanceof blueBall){
                    if(redBallsCount > 0){
                        balls[i].pos.x = width/2;
                        balls[i].pos.y = tableHeight/2;
                        balls[i].vel.mult(0); // Reset velocity to stop any residual motion
                    }
                    else{
                        balls.splice(i, 1);
                    }
                }
                //pink
                else if(balls[i] instanceof pinkBall){
                    if(redBallsCount > 0){
                        balls[i].pos.x = tableHeight +253;
                        balls[i].pos.y = tableHeight/2;
                        balls[i].vel.mult(0); // Reset velocity to stop any residual motion
                    }
                    else{
                        balls.splice(i, 1);
                    }
                }
                //black
                else if(balls[i] instanceof blackBall){
                    if(redBallsCount > 0){
                        balls[i].pos.x = tableHeight +455;
                        balls[i].pos.y = tableHeight/2;
                        balls[i].vel.mult(0); // Reset velocity to stop any residual motion
                    }
                    else{
                        balls.splice(i, 1);
                    }
                }
            }
                sunk = true;
            }
            if (sunk === true) break;
        }

    
    }   

    // Draw pockets after, else will disappear if no balls left on array (pockets were previously drawn in ball array).
    for (let k = 0; k < pockets.length; k++){
        pockets[k].render();
    }

    cue.update(cueBsunk);
    cue.render();

    // Check if the cue ball is not active and sunk
    if (!cueActive && cueBsunk) {
        // Check if the cue ball is in a pocket
        for (let k = 0; k < pockets.length; k++) {
            if (pockets[k].checkSink(balls[0])) {
                resetCueBall(); // Reset the cue ball's position
                break; // Exit the loop once the ball is found in a pocket
            }
        }
    }

}

function mouseDragged(){
    cueActive = true;   
}

function touchStarted(){
    cueActive = true;
}

function touchEnded(){
    cueActive = false;
}

// Add this function to reset the cue ball's position
function resetCueBall() {
    balls[0].pos.x = tableWidth/2 - 350;
    balls[0].pos.y = tableHeight/2 + 60;
    balls[0].vel.mult(0); // Reset velocity to stop any residual motion
    cueBsunk = false;
}

// Modify the cueBallSunk function to call resetCueBall
function cueBallSunk() {
    resetCueBall();
}

function setupBalls(){
    
    // Place balls on table.
        cueBsunk = false;
        balls.push(new CueBall(24));
        
        // Triangle.
        let bD = 24;    // Diameter of balls.
        let startX = 0.51*tableWidth; // Adjusted starting position
        
        for (let row = 0; row < 5; row++) {
        let x = startX + row * 20;
        let y = tableHeight / 2 +  row*12;
        for (let col = 0; col <= row; col++) {
            balls.push(new redBall(x+260, y, bD));
            y=y-22;
        }
    }
    //yellow
    balls.push(new yellowBall(tableHeight/2 +50 , tableHeight/2+90, bD))
    // brown 
    balls.push(new brownBall(tableHeight/2 +50 , tableHeight/2 , bD))
    // green
    balls.push(new greenBall(tableHeight/2 +50 , tableHeight/2-90 , bD))
    // blue
    balls.push(new blueBall(tableWidth/2 , tableHeight/2 , bD))
    // pink 
    balls.push(new pinkBall(tableHeight +253, tableHeight/2, bD))
    // black
    balls.push(new blackBall(tableHeight +455 , tableHeight/2, bD))
    
}

function setupPockets(){
   
    for (let i = 0; i < 6; i++){
       pockets.push(new Pocket(0,0));
    }
    pockets[0].pos.x = topEdge.pos.x+7 - (topEdge.wid/2)+7;
    pockets[0].pos.y = topEdge.pos.y+5 + topEdge.hid * 0.2;
    pockets[1].pos.x = topEdge.pos.x-7 + (topEdge.wid/2)-7;
    pockets[1].pos.y = topEdge.pos.y+5 + topEdge.hid * 0.2;
    pockets[2].pos.x = botEdge.pos.x+7 - (botEdge.wid/2)+7;
    pockets[2].pos.y = botEdge.pos.y-5 - botEdge.hid * 0.2;
    pockets[3].pos.x = botEdge.pos.x-7 + (botEdge.wid/2)-7;
    pockets[3].pos.y = botEdge.pos.y-5 - botEdge.hid * 0.2;
    pockets[4].pos.x = tableWidth/2;
    pockets[4].pos.y = botEdge.pos.y-3;
    pockets[5].pos.x = tableWidth/2;
    pockets[5].pos.y = topEdge.pos.y+3 ; 
}

/*
Code Design Explanation:

Object-oriented Approach:
The code uses an object-oriented approach, defining classes for various elements such as Edge, Ball, Cue, Pocket, and different colored balls.

Physics Simulation:
The Edge class represents the boundaries of the table, checking for ball collisions and rendering the table edges.
The Ball class extends the Edge class and introduces physics for ball movement, collisions, and rendering.
Colored balls (redBall, yellowBall, etc.) extend the Ball class, each with its unique rendering style.

Pocket and Sinking Mechanism:
The Pocket class represents the pockets on the table, checking if a ball has sunk into a pocket.
When a ball is pocketed, it is removed from the array, and its type is checked to implement specific rules for colored balls.

Cue and CueBall Interaction:
The Cue class is responsible for rendering the cue stick and handling interactions with the cue ball.
The cue stick is drawn from the mouse position to the cue ball, and the checkStrike function influences the cue ball's acceleration.
The CueBall class extends the Ball class and introduces specific behavior for the cue ball, such as resetting its position when pocketed.

User Interaction:
The mouseDragged and touchStarted functions control cue activation when the mouse is dragged or touched, and touchEnded deactivates the cue.

Randomized Initial Ball Placement:
The setupBalls function randomly places balls on the table, including the cue ball and colored balls in a triangular arrangement.

Message Display:
The displayTimedMessage function is used to display messages on the screen for a specified duration, notifying users of events like pocketing the cue ball.

Extension and Unique Idea:

The unique idea in this implementation is the incorporation of colored balls with different rules for each type. For example:
Red balls are pocketed as they are without any specific conditions.
Colored balls are reset to its own specific position if red balls are still on the table.

Report Quality:
The code design is well-structured with clear separation of concerns using classes for different elements.
The explanation provides insights into the purpose of each class and function.
The unique idea of handling different colored balls in a billiards simulation adds complexity and realism to the simulation.
*/