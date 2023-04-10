// se connecter au serveur Socket.IO 
const socket = io('http://localhost:3000');

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext('2d');

const h = canvas.height; 
const w = canvas.width;

const color = "#f9f9f9";

const game_over = document.querySelector('#game-over-sound');
const hit = document.querySelector('#ball-hit-sound');
hit.playbackRate = 10; // vitesse de lecture du son

/*
// Définir des variables pour stocker l'état des fléches
let leftArrowPressed = false;
let rightArrowPressed = false;
*/

var spacePressed = false;
var two_clients = false;

var score1 = 0;
var score2 = 0;

var ID = 0;
var ID1 = null;
var ID2 = null;

var ball = {
  x: w/2,
  y: h/2,
  r: 8,
  dx: 1.2,
  dy: 1.2
};

var paddle1 = {
  x: 10,
  y: h/2 - 40,
  w: 15,
  h: 80,
  dy:5
};

var paddle2 = {
  x: w - 25,
  y: h/2 - 40,
  w: 15,
  h: 80,
  dy:5
};
 

function drawCircle(x, y, r,color='black') {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawRect(x, y, w, h, color='black' ) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawNet() {
  ctx.beginPath();
  ctx.clearRect(w/2.5, 0, w/4, 45)
  ctx.font = "small-caps 50px Arial";
  ctx.strokeText(score1, w/2-50 , 40);    
  ctx.strokeText(score2,  w/2+30 , 40);   
  
  for (var i = 10; i < h; i += 40) {
    drawRect(w/2-1, i, 2, 20);
  }

}


document.addEventListener('mousemove', function(event) {
  // Emit la position de la souris au serveur
  if (ID == ID2) {
  socket.emit('mouse', event.clientY );
  }
});

// Ajouter des event listeners pour les évenements des keydown et keyup 
document.addEventListener('keydown', function(event) {
  if (document.activeElement.nodeName.toLowerCase() != "input") { // pour ne pas prendre en compte les touches qd on est dans le chat
  if (event.code == 'Space') {
    socket.emit('space', ID); 
  }
  if (event.code === 'ArrowLeft' && ID == ID1 ) {
    // leftArrowPressed = true;
    socket.emit('leftArrowPressed', true); 
  } else if (event.code === 'ArrowRight' && ID == ID1) {
    // rightArrowPressed = true;
    socket.emit('rightArrowPressed', true); 
  }
}
});

/*
document.addEventListener('keyup', function(event) {
  if (event.code === 'ArrowLeft') {
    leftArrowPressed = false;
  } else if (event.code === 'ArrowRight') {
    rightArrowPressed = false;
  }
});
*/

function draw() {

  // dessine le ballon
  drawCircle(ball.x, ball.y, ball.r);

  // dessine les paddles
  drawRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
  drawRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);

  // dessiner la network et afficher le score
  drawNet();
}

function clear_canvas() {  // fonction qui efface le ballon et le paddle1 pour les retracer en nouvelle position
  drawCircle(ball.x, ball.y, ball.r+1, color); 
  ctx.clearRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
}



function move_ball() {
  
  ball.x += ball.dx;
  ball.y += ball.dy;


  // vérifier les collisions en haut et en bas
  if (ball.y + ball.r >= h || ball.y - ball.r <= 0) {
    hit.play();
    ball.dy = -ball.dy;
  }

  // vérifier les collisions à droite
  if (ball.x + ball.r >= w ) {
    hit.play();
    ball.dx = -ball.dx;
    socket.emit('goal_joueur1', score1);
  }

  // vérifier les collisions à gauche
  if (ball.x - ball.r <= 0) {
    hit.play();
    ball.dx = -ball.dx;
    socket.emit('goal_joueur2', score2); 
  }


  // vérifier les collisions avec les paddles
  if (ball.x - ball.r <= paddle1.x + paddle1.w && 
      ball.y + ball.r >= paddle1.y && 
      ball.y - ball.r <= paddle1.y + paddle1.h) {
        hit.play();
        ball.x -= ball.dx;
        ball.dx = -ball.dx;
  }

  if (ball.x + ball.r >= paddle2.x && 
      ball.y + ball.r >= paddle2.y && 
      ball.y - ball.r <= paddle2.y + paddle2.h) {
        hit.play();
        ball.x -= ball.dx;
        ball.dx = -ball.dx;
  }
}

function move_paddle1(left,right) {
  // si on appuie sur la fleche droite, déplacer paddle1 en bas par paddle1.dy
  if (right && paddle1.y + paddle1.h < canvas.height){
    paddle1.y +=10*paddle1.dy;
    socket.emit('move', paddle1.y);
  }

  // si on appuie sur la fleche droite, déplacer paddle1 en haut par paddle1.dy
  if (left && paddle1.y>0){
    paddle1.y-=5*paddle1.dy;
    socket.emit('move', paddle1.y);
  }
}

/*
function move() {
  move_ball();
  // move_paddle1();
}
*/

function restart_game() {
  spacePressed = false; 
  x = ball.x;
  y = ball.y;
  ball.x = w/2;
  ball.y = h/2;
  drawCircle(x, y, ball.r+1, color); 
  draw();
};


function check_end() {
  // arreter tout, afficher une pop-up: "vous avez perdu", ou "vous avez gagné"
  // quand on appuit sur espace, le jeu doit recommencer
  if (score1 == 5) {
    socket.emit('end_game', ID1);
    }
  if (score2 == 5) {
    socket.emit('end_game', ID2);
    }

};



socket.on ('start', (data) => {
  if (data) { // qd on a deux clients: data = connected clients
  two_clients = true;
  ID1 = data[0]; // joueur 1
  ID2 = data[1]; // joueur 2
  console.log('ID1:', ID1);
  console.log('ID2:', ID2);
  console.log('joueur 1:', ID==ID1);
  console.log('joueur 2:', ID==ID2);
  }
  else {
    restart_game(); // qd un client s'est déconnecté: data = false
    score1 = 0; 
    score2 = 0;
    // alert("L'autre joueur a quitté");

  }
});

socket.on('connect', ()=>{
  ID = socket.id; // l'ID de ce client
  console.log("ID:",ID);
});


socket.on('spacePressed', (data) => {
  if (data==ID) {
    setTimeout(()=>{spacePressed = true}, 80);
  }
  else {
    spacePressed = true;
  }
});

/*
socket.on('move', data => {
  ctx.clearRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
  paddle1.y = data;
});
*/

socket.on('leftArrow', (data)=>{
  if (data){
    ctx.clearRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
    move_paddle1(true,false);
  };
});

socket.on('rightArrow', (data)=>{
  if (data){
    ctx.clearRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
    move_paddle1(false,true);
  };
});

socket.on('mouseMove',(data)=> {
  // si le mvt est vers le haut c-a-d eventY < paddle2.y
  if (data < paddle2.y && paddle2.y>0){
    ctx.clearRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
    paddle2.y = data;
  };
  if (data > paddle2.y && paddle2.y + paddle2.h < canvas.height){
    ctx.clearRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
    paddle2.y = data;
  };
});


socket.on('score1', (data) => {
  score1 = data; 
  restart_game();
  check_end();
});

socket.on('score2', (data) => {
  score2 = data; 
  restart_game();
  check_end();
});

socket.on('end',(data)=>{
  ID_gagnant = data;
  restart_game();
  if (ID == ID_gagnant){
  alert('Vous avez gagné!');
  }
  else {
    alert('Vous avez perdu!')
  }
  game_over.play();
});



function gameLoop() { 

  if (two_clients && spacePressed ) {
    clear_canvas();
    move_ball();
    draw();
  }
  
  else if (two_clients) { // executer ce bloc apres un goal quand on n'a pas encore appuyé sur space, permet le mvt des paddles
    clear_canvas();
    draw();
  }

}



setInterval(gameLoop, 1);




