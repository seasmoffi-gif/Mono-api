import express from "express";
import bodyParser from "body-parser";
import { db, ObjectId } from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Anime al
app.get("/api/getanime/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const anime = await db.collection("animes").findOne({ mal_id: parseInt(id) });
    if (!anime) return res.status(404).json({ error: "Anime bulunamadı" });
    res.json(anime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bölüm linki al
app.get("/api/getstream/:id/:episode", async (req, res) => {
  try {
    const stream = await db.collection("streams").findOne({
      anime_id: new ObjectId(req.params.id),
      episode: parseInt(req.params.episode)
    });
    if (!stream) return res.status(404).json({ error: "Stream bulunamadı" });
    res.json(stream);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Yeni anime ekle
app.post("/api/addanime", async (req, res) => {
  try {
    const { title, description, year, image, mal_id, genres, total} = req.body;
    const result = await db.collection("animes").insertOne({ title, description, year, image, mal_id, genres, total, created_at: new Date() });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Anime düzenle
app.put("/api/editanime", async (req, res) => {
  try {
    const { id, title, description, image } = req.body;
    const result = await db.collection("animes").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, image } }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
