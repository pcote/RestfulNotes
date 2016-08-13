"""
model.py

Persistence module for CRUD operations concerning notes.
"""
from sqlalchemy import create_engine, Column, Integer, Text, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from configparser import ConfigParser
from datetime import datetime


dir_path = __file__.rsplit("/", maxsplit=1)[0]
config_file_name = "{}/{}".format(dir_path, "config.ini")
parser = ConfigParser()
parser.read(config_file_name)
model_config = parser["model"]
user = model_config.get("user")
pw = model_config.get("password")
host = model_config.get("host")

ct_url = "mysql+pymysql://{}:{}@{}/notesdb".format(user, pw, host)
eng = create_engine(ct_url)

Base = declarative_base()
Session = sessionmaker(bind=eng)


class Note(Base):
    """
    ORM class mapping for notes.
    """
    __tablename__ = "notes"
    id = Column(Integer, autoincrement=True, primary_key=True)
    title = Column(Text, nullable=False)
    detail = Column(Text, nullable=False)
    last_updated = Column(TIMESTAMP, nullable=False)


def add_note(title, detail):
    """
    Adds new note to the datastore.
    :param title: Title of the note.
    :param detail: Body of the note with detailed info.
    :return: Generic okay message string for adding the note.
    """
    sess = Session()
    new_note = Note(title=title, detail=detail, last_updated=datetime.now())
    sess.add(new_note)
    sess.commit()
    return "add_note okay"


def delete_note(note_id):
    """
    Remove a note from the data store.
    :param note_id: key id of the note to be deleted.
    :return: Generic okay message string for the deletion
    """
    sess = Session()
    note = sess.query(Note).filter_by(id=note_id).one()
    sess.delete(note)
    sess.commit()
    return "delete_note okay"


def change_note(note_id, title, detail):
    """
    Store changes to some specific note to the data store.
    :param note_id: key id of the note.
    :param title: Title of the note
    :param detail: Detail info in the note.
    :return: A generic okay message string for this change.
    """
    sess = Session()
    note = sess.query(Note).filter_by(id=note_id).one()
    note.title = title
    note.detail = detail
    note.last_updated = datetime.now()
    sess.add(note)
    sess.commit()
    return "change_note okay"


def get_notes():
    """
    Get a list of all the note records.
    :return: a list of dictionaries each of which represents a note.
    """
    sess = Session()
    notes = sess.query(Note).all()
    return [dict(id=note.id, title=note.title, detail=note.detail, last_updated=note.last_updated)
            for note in notes]


Base.metadata.create_all(eng)

if __name__ == '__main__':
    Base.metadata.create_all(eng)
    print(get_notes())