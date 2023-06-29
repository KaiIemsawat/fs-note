import express from "express";
import * as NoteCtrl from "../controllers/noteController";

const router = express.Router();

router.get("/", NoteCtrl.getNotes);
router.get("/:noteId", NoteCtrl.getNote);
router.post("/", NoteCtrl.createNote);
router.patch("/:noteId", NoteCtrl.updateNote);

export default router;
