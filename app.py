import os

from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SESSION_TYPE"] = "filesystem"
app.config['SECRET_KEY'] = "l5qGfXFue2"
socketio = SocketIO(app, cors_allowed_origins='*')

#users = []
channels = ["General"]

@app.route("/", methods=["GET", "POST"])
def index():
    if "username" in session:

        #if session.get("username") in users:
        return render_template("chat.html", channels = channels)
        
        #else:
            #return render_template("index.html")

    else:
        return render_template("index.html")



@app.route("/chat", methods=["GET", "POST"])
def chat():

    if request.method == "POST":

        username = request.form.get("username")
        
        if not username:
            flash("Debe introducir un usuario")
            return redirect("/")
        
        #if username in users:
            #flash("El usuario ya esta en el chat")
            #return redirect("/")
                
        #users.append(username) 
        session["username"] = username
        return redirect("/")
    
    else:

        return redirect("/")

@socketio.on("nuevo_canal")
def nuevo_canal(data):

    print(data)

    canal = data['sala']

    usuario = data['usuario']

    if canal == channels:
        emit("mostrar_canales", {"codigo": "existe", "usuario": usuario})


    else:
        channels.append(canal)
        emit("mostrar_canales", {"sala": canal, "usuario": usuario})


@socketio.on("mensajes")
def mensaje(data):

    print(data)
    print(data['msg'])


    emit("mostrar_mensaje", {'msg': data['msg'], 'usuario': data['usuario'], 'tiempo': data['tiempo']}, broadcast = True)


@app.route("/logout")
def logout():
    

    session.clear()
    

    return redirect("/")
    

    




if __name__ == '__main__':
    socketio.run(app, debug=True)