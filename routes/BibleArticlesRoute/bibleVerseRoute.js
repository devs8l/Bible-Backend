import express from "express";
import { verifyAdmin } from "../../middleware/authMiddleware.js";
import {
  addBibleVerse,
  getBibleVerses,
  updateBibleVerse
} from "../../controllers/BibleArticlesControllers/bibleArticlesControllers.js";

const bibleArticlesRouter = express.Router();

bibleArticlesRouter.post("/bible-verses", verifyAdmin, addBibleVerse);
bibleArticlesRouter.put("/bible-verses-update", verifyAdmin, updateBibleVerse);
bibleArticlesRouter.get("/bible-verses",  getBibleVerses);



export default bibleArticlesRouter;
