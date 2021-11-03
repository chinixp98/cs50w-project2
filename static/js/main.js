document.addEventListener('DOMContentLoaded', () => {

    // Para conectarse a la websocket
    var socket = io.connect(location.protocol +'//' + document.domain + ':' + location.port);
    var room;

    var usuario = localStorage.getItem("usuarios");

    document.querySelector("#add-channel").onclick = () => {

        room = document.querySelector("#channel-name").value;

        socket.emit ("nuevo_canal", {
            'usuario': usuario,
            'sala': room
        });
    }

    // Conexiones a socket

    socket.on("mostrar_canales", data => {
        if (data.codigo === "existe"){
            alert("El canal ya existe");
        }

        else {
            var lista_canal = document.querySelector("#lista_canal")

            lista_canal.innerHTML += `<div class="row"><a>${ data.sala }</a></div>`
        }
    });

    document.querySelector("#enviar").onclick = () => {
        var mensajes = document.querySelector("#input_chat").value;
        var tiempo = new Date;
        socket.emit("mensajes", {'msg': mensajes, 'usuario': usuario, 'tiempo': tiempo})
    }

    socket.on("mostrar_mensaje", data => {
        var lista_mensaje = document.querySelector("#mensajes")

        console.log(data)

        lista_mensaje.innerHTML += `<p>${ data.usuario } dice:</p> <p>${ data.msg } ${ data.tiempo }</p>`
    });
});