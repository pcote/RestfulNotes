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
    __tablename__ = "notes"
    id = Column(Integer, autoincrement=True, primary_key=True)
    title = Column(Text, nullable=False)
    detail = Column(Text, nullable=False)
    last_updated = Column(TIMESTAMP, nullable=False)


def add_note(title, detail):
    sess = Session()
    new_note = Note(title=title, detail=detail, last_updated=datetime.now())
    sess.add(new_note)
    sess.commit()
    return "add_note okay"


def delete_note(note_id):
    sess = Session()
    note = sess.query(Note).filter_by(id=note_id).one()
    sess.delete(note)
    sess.commit()
    return "delete_note okay"


def change_note(note_id, title, detail):
    sess = Session()
    note = sess.query(Note).filter_by(id=note_id).one()
    note.title = title
    note.detail = detail
    note.last_updated = datetime.now()
    sess.add(note)
    sess.commit()
    return "change_note okay"


def get_notes():
    sess = Session()
    notes = sess.query(Note).all()
    return [dict(id=note.id, title=note.title, detail=note.detail, last_updated=note.last_updated)
            for note in notes]

Base.metadata.create_all(eng)

if __name__ == '__main__':
    Base.metadata.create_all(eng)
    #add_note("Chores", "Take care of dishes and trash today.")
    #change_note(4, "Chores", "Take care of dishes, trash, and watering plants")
    print(get_notes())