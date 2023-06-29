import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, resp, next) => {
    try {
        const notes = await NoteModel.find().exec();
        resp.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNote: RequestHandler = async (req, resp, next) => {
    const noteId = req.params.noteId; // this .noteId came from the params defind in route file. It could be different

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        resp.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

interface CreateNoteBody {
    title?: string;
    text?: string;
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, resp, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }

        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        resp.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

interface UpdateNoteParams {
    noteId: string,
}

interface UpdateNoteBody {
    title?: string;
    text?: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, resp, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        if (!newTitle) {
            throw createHttpError(400, "Note must have a title");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();

        resp.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};
