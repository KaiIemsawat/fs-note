import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Note as NoteModel } from "./models/noteModel";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as NoteApi from "./network/notes_api";
import AddNoteDialog from "./components/AddNoteDialog";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

    useEffect(() => {
        async function loadNote() {
            try {
                const notes = await NoteApi.fetchNote();
                setNotes(notes);
            } catch (error) {
                console.error(error);
                alert(error);
            }
        }
        loadNote();
    }, []);

    async function deleteNote(note: NoteModel) {
        try {
            await NoteApi.deleteNote(note._id);
            setNotes(
                notes.filter((existingNote) => existingNote._id !== note._id)
            );
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Container>
            <Button
                onClick={() => setShowAddNoteDialog(true)}
                className={`mb-4 ${stylesUtils.blockCenter}`}>
                add new note
            </Button>
            <Row xs={1} md={2} xl={3} className="g-4">
                {notes.map((note) => (
                    <Col key={note._id}>
                        <Note
                            note={note}
                            className={styles.note}
                            onDeleteNoteClick={deleteNote}
                        />
                    </Col>
                ))}
            </Row>
            {showAddNoteDialog && (
                <AddNoteDialog
                    onDismiss={() => setShowAddNoteDialog(false)}
                    onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setShowAddNoteDialog(false);
                    }}
                />
            )}
        </Container>
    );
}

export default App;
