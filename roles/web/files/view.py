from flask import Flask, redirect, request, jsonify
import model



app = Flask(__name__)

@app.route("/")
def index():
    """
    Standard index redirect
    :return: a redirect to the index page.
    """
    return redirect("/static/index.html")

@app.route("/addnote", methods=["POST"])
def add_note():
    """
    Add a note
    Uses "title" and "detail" info from the passed in json object
    :return: A status string result that came from the persistence call to add the rec.
    """
    json_ob = request.get_json()
    title = json_ob.get("title")
    detail = json_ob.get("detail")
    status = model.add_note(title, detail)
    return status


@app.route("/deletenote/<note_id>", methods=["DELETE"])
def delete_note(note_id):
    """
    Delete the specified note.
    :param note_id: Key ID of the note to delete
    :return:A string representing the status result of the deletion attempt.
    """
    status = model.delete_note(note_id)
    return status


@app.route("/changenote", methods=["PUT"])
def change_note():
    """
    Change information about a note.
    Takes a json object made up of an "id", "title", and "detail"
    :return: A status result from making the change in the datastore.
    """
    json_ob = request.get_json()
    id = json_ob.get("id")
    title = json_ob.get("title")
    detail = json_ob.get("detail")
    status = model.change_note(id, title, detail)
    return status


@app.route("/notes", methods=["GET"])
def get_notes():
    """
    Gets all the notes.
    :return: Every note as a json object.
    """
    notes = model.get_notes()
    json_data = jsonify(dict(notes=notes))
    return json_data


if __name__ == '__main__':
    app.run(debug=True)