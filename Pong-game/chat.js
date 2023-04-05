var init = 0;
var joueurs = {}; // on y met les ids et les noms des joueurs

const messages = document.getElementById("messages");
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');


socket.on('connect', ()=>{
    ID = socket.id;
});


messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    data = {msg:message, id: ID};
    socket.emit('chat message', data);
    messageInput.value = '';
  });
  
  
socket.on('message', (data) => {
    console.log('Message reçu:', data.msg);
    if (init!=2){
        joueurs[data.id] = data.msg; // le premier msg doit contenir le nom
        init++
        if (init==2){
            messageInput.placeholder = 'Taper votre message';
        }
    }

    else if (ID == data.id && init==2) {
        messages.value +=   'Vous : ' + data.msg +'\n';
    }

    else {
        messages.value += joueurs[data.id] + ' : '  + data.msg +'\n';
        };

  });


  