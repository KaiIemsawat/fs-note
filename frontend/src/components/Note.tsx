import React from "react";
import styles from "../styles/note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Note as NoteModel } from "../models/noteModel";
import { Card } from "react-bootstrap";
import { formatDate } from "../utils/formatDate";
import { MdDisabledByDefault } from "react-icons/md";

interface NoteProps {
    note: NoteModel;
    onDeleteNoteClick: (note: NoteModel) => void;
    className?: string;
}

const Note = ({ note, onDeleteNoteClick, className }: NoteProps) => {
    const { title, text, createdAt, updatedAt } = note;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card className={`${styles.noteCard} ${className}`}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}{" "}
                    <MdDisabledByDefault
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteNoteClick(note);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>{text}</Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    );
};

export default Note;
