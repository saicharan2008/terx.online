var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage,background,backgroundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameover;
var gamerestart;
var gameovering;
var gamerestarting;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  backgroundImage = loadImage("bc.png");
  
  cloudImage = loadImage("cloud.png");
  gameovering = loadImage("gameOver.png");
  gamerestarting = loadImage("restart.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkPoint=loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(600,500);

  background=createSprite(windowWidth,windowHeight);
  background.addImage("background",backgroundImage);
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider("rectangle",0,0,150,100);
  trex.debug=false;
  ground = createSprite(200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  gameover = createSprite(width-300,height-140,10,10);
  gameover.addImage(gameovering)
  gameover.scale=3.5;
  gamerestart = createSprite(width-300,height-100,10,10);
  gamerestart.addImage(gamerestarting)
  gamerestart.scale=0.5;
  invisibleGround = createSprite(200,height-10,400,10);
  invisibleGround.visible = false;
  
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  
  
  score = 0;
}

function draw() {
  
  text("Score: "+ score, 500,50);
 
  var n =5
  console.log(n)
  
  if(gameState === PLAY){
    //move the ground
    gameover.visible = false;
    gamerestart.visible = false;
    ground.velocityX = -(4+Math.round(score/100));
    if(trex.isTouching(obstaclesGroup)){
      gameState=END;
      die.play();
     
  
      }
    
    if(score%100===0 && score>0){
      checkPoint.play();
    }
     score = score + Math.round(frameCount/300);
     spawnObstacles();
     if((touches.length>0||keyDown("space"))&& trex.y >= height-100) {
    trex.velocityY = -13;
    jump.play();
      touches=[] 
  }
     if (ground.x < 0){
    ground.x = ground.width/2;
  }    
  
   //spawn the clouds
  spawnClouds();
  
  }
  else if(gameState === END){
     gameover.visible = true;
    gamerestart.visible = true;
    //stop the ground
    ground.velocityX = 0;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  cloudsGroup.setVelocityXEach(0);
 obstaclesGroup.setVelocityXEach(0);
  trex.changeAnimation("collided" , trex_collided)
 
    if(mousePressedOver(gamerestart)){
      console.log("restart")
      restart();
    }
  }
  

  
  trex.velocityY = trex.velocityY + 0.8
  
 
  trex.collide(invisibleGround);
  
 
  //spawn obstacles on the ground
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width-200,height-35,10,40);
   obstacle.velocityX = -(6+Math.round(score/100));

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(height-190,height-140));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3+Math.round(score/100));
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}
function restart(){
  gameState=PLAY
cloudsGroup.destroyEach();
   obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
}