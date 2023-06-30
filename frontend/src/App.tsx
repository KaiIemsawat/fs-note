import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Note as NoteModel } from "./models/noteModel";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import * as NoteApi from "./network/notes_api";

function App() {
    const [notes, setNote] = useState<NoteModel[]>([]);

    useEffect(() => {
        async function loadNote() {
            try {
                const notes = await NoteApi.fetchNote();
                setNote(notes);
            } catch (error) {
                console.error(error);
                alert(error);
            }
        }
        loadNote();
    }, []);

    return (
        <Container>
            <Row xs={1} md={2} xl={3} className="g-4">
                {notes.map((note) => (
                    <Col key={note._id}>
                        <Note note={note} className={styles.note} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default App;
