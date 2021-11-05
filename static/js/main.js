var socket;
document.addEventListener('DOMContentLoaded', () => {

    // Para conectarse a la websocket
    socket = io.connect(location.protocol +'//' + document.domain + ':' + location.port);
    var room;

    // Mi usuario uwu
    var usuario = localStorage.getItem("usuarios");


    // Se conecta al canal general :D
    if (localStorage.getItem("ultimo-canal") == null) {

        localStorage.setItem("ultimo-canal", "general");

    }

    // Se conecta al ultimo canal pero en este caso el general por defecto
    socket.emit("join", {
        'username': usuario,
        'sala': localStorage.getItem("ultimo-canal")
    })

    // Carga el ultimo canal que seleccionamos

    document.querySelector("#nombre-canal").innerHTML = localStorage.getItem("ultimo-canal");

    const formularioCanal = document.getElementById("formCanal");
 

    // Para agregar canales :D

    document.querySelector("#add-channel").onclick = () => {

        room = document.querySelector("#channel-name").value;

        socket.emit ("nuevo_canal", {
            'usuario': usuario,
            'sala': room
        });

        formularioCanal.reset()
    }

    // Mostramos el canal y validamos si existe o aseguramos que hayan puesto algo válido

    socket.on("mostrar_canales", data => {

        if (data.codigo === "existe"){
            alert("El canal ya existe");
        }

        else if (data.codigo === ""){
            alert("Debe introducir un canal")
        }

        else {
            var lista_canal = document.querySelector("#contenedor-canales")

            lista_canal.innerHTML += `<div class="row" id="canal-creado" onclick="seleccionarCanal('${ data.sala }')"><span id="sala">${ data.sala }</span></div>`
        }
    });

    const form1 = document.getElementById("formulario1");

    // Evento de enviar mensajes uwu
    document.querySelector("#enviar").onclick = () => {
        var mensajes = document.querySelector("#input_chat").value;
        var tiempo = new Date;
           
        socket.emit("mensajes", {'msg': mensajes, 'usuario': usuario, 'sala': localStorage.getItem("ultimo-canal"), 'tiempo': tiempo.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})})      

        form1.reset();
    }


    // Se muestra el mensaje :D

    socket.on("mostrar_mensaje", data => {
        var lista_mensaje = document.querySelector("#mensajes")

        console.log(data)

        lista_mensaje.innerHTML += `<font color="green">${ data.usuario }<font size="1" color="gray"> ${ data.tiempo }</font></font><div id="estilo-mensaje"><p>${ data.msg } </p></div>`
    });

        // Enviar mensaje de que entramos o salimos de un canal unu
    socket.on("mostrar_log", data => {
        var lista_mensaje = document.querySelector("#mensajes")

        console.log(data)

        lista_mensaje.innerHTML += `<br><font color="red">${ data.msg }</font><br></br>`
    });
});



// Funciones 

// Funcion para limpiar el localStorage cuando el usuario cierra sesión

function Clear () {
    localStorage.clear();
}

// Funcion para seleccionar canales, cargar los mensajes de ese canal e indicar que estamos en ese canal

function seleccionarCanal (canal) {

    socket.emit("leave", {
        'username': localStorage.getItem("usuarios"),
        'sala': localStorage.getItem("ultimo-canal")
    })

    document.querySelector("#mensajes").innerHTML = ""

    localStorage.setItem("ultimo-canal", canal);

    document.querySelector("#nombre-canal").innerHTML = canal;

    socket.emit("join", {
        'username': localStorage.getItem("usuarios"),
        'sala': localStorage.getItem("ultimo-canal")
    })
}

