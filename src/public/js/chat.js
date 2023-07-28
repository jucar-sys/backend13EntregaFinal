// CHAT
// Declaramos la variable socket
const socket = io();
// -variables para el chat
let user = sessionStorage.getItem('user') || '';
const chatbox = document.getElementById('chatbox');

if(!user){
    Swal.fire({
        title: 'Autenticación',
        input: 'text',
        text: 'Ingresa tu correo',
        inputValidator: value => {
            return !value.trim() && 'Por favor ingresa tu email de usuario'
        },
        allowOutsideClick: false,
    }).then(result => {
        user = result.value;
        document.getElementById('username').innerHTML = user;
        sessionStorage.setItem("user", user);
        socket.emit('new', user);
    });
} else {
    document.getElementById('username').innerHTML = user;
    socket.emit('new', user);
}

// Enviar mensajes
chatbox.addEventListener('keyup', event => {
    if(event.key === 'Enter'){
        const message = chatbox.value.trim();
        if(message.length > 0){
            socket.emit('message', {
                user,
                message
            });
            chatbox.value = '';
        }
    }
});

// Recibir mensajes
socket.on('logs', data => {
    console.log(data);
    const divLogs = document.getElementById('logs');
    let messages = '';

    data.forEach(message => {
        messages = `<li class="list-group-item"><b>${message.user}</b> - ${message.message}</li>` + messages;
    });

    divLogs.innerHTML = messages;
});