import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Note as NoteModel } from "./models/noteModel";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as NoteApi from "./network/notes_api";
import AddNoteDialog from "./components/AddEditNoteDialog";
import { FaPlus } from "react-icons/fa";
import AddEditNoteDialog from "./components/AddEditNoteDialog";

function App() {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [showNoteLoadingErr, setShowNoteLoadingErr] = useState(false);

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

    useEffect(() => {
        async function loadNote() {
            try {
                setShowNoteLoadingErr(false);
                setNotesLoading(true);
                const notes = await NoteApi.fetchNote();
                setNotes(notes);
            } catch (error) {
                console.error(error);
                setShowNoteLoadingErr(true);
            } finally {
                setNotesLoading(false);
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

    const notesGrid = (
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
            {notes.map((note) => (
                <Col key={note._id}>
                    <Note
                        note={note}
                        className={styles.note}
                        onNoteClicked={setNoteToEdit}
                        onDeleteNoteClick={deleteNote}
                    />
                </Col>
            ))}
        </Row>
    );

    return (
        <Container className={styles.notesPage}>
            <Button
                onClick={() => setShowAddNoteDialog(true)}
                className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}>
                <FaPlus />
                add new note
            </Button>
            {notesLoading && <Spinner animation="border" variant="primary" />}

            {showNoteLoadingErr && (
                <p>Something went wrong. Pleaes refresh the page</p>
            )}

            {!notesLoading && !showNoteLoadingErr && (
                <>
                    {notes.length > 0 ? (
                        notesGrid
                    ) : (
                        <p>There is no note in database</p>
                    )}
                </>
            )}

            {showAddNoteDialog && (
                <AddNoteDialog
                    onDismiss={() => setShowAddNoteDialog(false)}
                    onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setShowAddNoteDialog(false);
                    }}
                />
            )}

            {noteToEdit && (
                <AddEditNoteDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updateNote) => {
                        setNotes(
                            notes.map((existingNote) =>
                                existingNote._id === updateNote._id
                                    ? updateNote
                                    : existingNote
                            )
                        );
                        setNoteToEdit(null);
                    }}
                />
            )}
        </Container>
    );
}

export default App;
