import express from "express";
import * as NoteCtrl from "../controllers/noteController";

const router = express.Router();

router.get("/", NoteCtrl.getNotes);
router.get("/:noteId", NoteCtrl.getNote);
router.post("/", NoteCtrl.createNote);

export default router;
