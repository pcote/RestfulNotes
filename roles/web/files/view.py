from flask import Flask, redirect

app = Flask(__name__)

@app.route("/")
def index():
    return redirect("/static/index.html")
