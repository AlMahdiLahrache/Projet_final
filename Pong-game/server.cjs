const express = require('express'); 
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); 
const path = require('path');



app.use(express.static(path.join(__dirname)));

var numClients = 0;
var connectedClients = [];

// Gérer les connexions des clients
io.on('connection', (socket) => {
  // Incrémenter le nombre de clients connectés
  connectedClients.push(socket.id);
  numClients++
  console.log("Un utilisateur s'est connecté");
  console.log('Numéro de clients:',numClients);

  if (numClients == 2) {
    io.emit('start', connectedClients);
  }
  socket.on('space', (space)=> {
    io.emit('spacePressed',true);
  })
  // Listen chat messages

  socket.on('chat message', (data) => {
    console.log('Message reçu:', data.msg);
    io.emit('message', data);
  });

  // Listen paddle1 movements 
  socket.on('move', (data) => {
    socket.broadcast.emit('move', data);
  });

  // Listen to mouse moves
  socket.on ('mouse', (data)=> {
    io.emit('mouseMove',data);
  });

  socket.on ('goal_joueur1', (data) => {
    data++
    socket.emit('score1',data);
  })

  socket.on ('goal_joueur2', (data) => {
    data++
    socket.emit('score2',data);
  })

  socket.on ('end_game', (data) => {
    io.emit('end',data); // data contient le joueur qui a gagné
  })


  socket.on('disconnect', () => {
    // Decrementer le nombre de clients connectés
    numClients--;
    const index = connectedClients.indexOf(socket.id);
    if (index > -1) { // only splice array when item is found
      connectedClients.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log("Un utilisateur s'est déconnecté");
    console.log('Numéro de clients:',numClients);
    io.emit('start',false);
    
  });
});

// Commencer le serveur
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Serveur sur le port ${PORT}`);
});



