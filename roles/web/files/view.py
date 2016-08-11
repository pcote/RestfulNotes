from flask import Flask, redirect, request, jsonify
import model

app = Flask(__name__)

@app.route("/")
def index():
    return redirect("/static/index.html")

@app.route("/addnote", methods=["POST"])
def add_note():
    json_ob = request.get_json()
    title = json_ob.get("title")
    detail = json_ob.get("detail")
    status = model.add_note(title, detail)
    return status


@app.route("/deletenote/<note_id>", methods=["DELETE"])
def delete_note(note_id):
    status = model.delete_note(note_id)
    return status


@app.route("/changenote", methods=["PUT"])
def change_note():
    json_ob = request.get_json()
    id = json_ob.get("id")
    title = json_ob.get("title")
    detail = json_ob.get("detail")
    status = model.change_note(id, title, detail)
    return status


@app.route("/notes", methods=["GET"])
def get_notes():
    notes = model.get_notes()
    json_data = jsonify(dict(notes=notes))
    return json_data


if __name__ == '__main__':
    app.run(debug=True)