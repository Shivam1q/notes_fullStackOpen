import { useState } from "react";
import Note from "./components/Note";
import { useEffect } from "react";
import notesService from "./services/notesService";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .update(id, changedNote)
      .then((changedNotes) => {
        setNotes(notes.map((note) => (note.id === id ? changedNotes : note)));
      })
      .catch((error) => {
        alert(`the note '${note.content}' was already deleted from server`);
      });
    setNotes(notes.filter((n) => n.id !== id));
  };

  useEffect(() => {
    console.log("effect");
    notesService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);
  console.log("render", notes.length, "notes");

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    console.log("buttons clicked", event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    notesService.create(noteObject).then((createdNotes) => {
      setNotes(notes.concat(createdNotes));
      setNewNote("");
    });
  };

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "important" : "all"}
      </button>
      <ul>
        {notesToShow.map((note) => {
          return (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          );
        })}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="type your notes...."
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
