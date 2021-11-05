from collections import deque
import os

from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SESSION_TYPE"] = "filesystem"
app.config['SECRET_KEY'] = "l5qGfXFue2"
socketio = SocketIO(app, cors_allowed_origins='*')


channels = ["General"]
canalMensaje = dict()
canalMensaje["General"] = deque(maxlen=100)

@app.route("/", methods=["GET", "POST"])
def index():
    if "username" in session:
        return render_template("chat.html", channels = channels)
       
    else:
        return render_template("index.html")



@app.route("/chat", methods=["GET", "POST"])
def chat():

    if request.method == "POST":

        username = request.form.get("username")
        
        if not username:
            flash("Debe introducir un usuario")
            return redirect("/")
        
        session["username"] = username
        return redirect("/")
    
    else:

        return redirect("/")

@socketio.on("nuevo_canal")
def nuevo_canal(data):

    print(data)

    canal = data['sala']

    usuario = data['usuario']

    if canal in channels:
        emit("mostrar_canales", {"codigo": "existe", "usuario": usuario})
    
    elif canal == "":
        emit("mostrar_canales", {"codigo": "", "usuario": usuario})

    else:
        channels.append(canal)
        canalMensaje[canal] = deque(maxlen=100)

        emit("mostrar_canales", {"sala": canal, "usuario": usuario})


@socketio.on("mensajes")
def mensaje(data):

    print(data)
    print(data['msg'])

    emit("mostrar_mensaje", {'msg': data['msg'], 'usuario': data['usuario'], 'tiempo': data['tiempo']}, to = data["sala"])

    

@socketio.on("join")
def Entrar_Sala(data):

    sala = data["sala"]
    username = data["username"]

    print("Entrar Sala")
    print(data)

    join_room(sala)

    emit("mostrar_log", {"msg": f"{username} ha entrado al canal "}, to = sala)



@socketio.on("leave")
def Salir_Sala(data):

    sala = data["sala"]
    username = data["username"]

    print("Salir Sala")
    print(data)

    leave_room(sala)

    emit("mostrar_log", {"msg": f"{username} ha salido del canal "}, to = sala)






@app.route("/logout")
def logout():
    

    session.clear()
    

    return redirect("/")
    

    




if __name__ == '__main__':
    socketio.run(app, debug=True)