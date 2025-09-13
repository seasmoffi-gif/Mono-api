import express from "express";
import bodyParser from "body-parser";
import { db, ObjectId } from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

// -------------------------
// Anime Middleware
// -------------------------
app.use((req, res, next) => {
  if (req.body) {
    const { title, description, year, image, mal_id, genres, total } = req.body;
    req.anime = { title, description, year, image, mal_id, genres, total };
  }
  next();
});

// -------------------------
// Stream Middleware
// -------------------------
app.use("/api/addstream", (req, res, next) => {
  if (req.body) {
    const { mal_id, episode, url, fansub } = req.body;
    req.stream = {
      mal_id,
      episode: episode ? parseInt(episode) : null,
      url,
      fansub,
      created_at: new Date(),
    };
  }
  next();
});

// -------------------------
// Anime Endpoints
// -------------------------
app.post("/api/addanime", async (req, res) => {
  try {
    const result = await db.collection("animes").insertOne({ ...req.anime, created_at: new Date() });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/editanime/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection("animes").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.anime }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

// -------------------------
// Stream Endpoints
// -------------------------
app.post("/api/addstream", async (req, res) => {
  try {
    if (!req.stream.mal_id || !req.stream.episode || !req.stream.url || !req.stream.fansub) {
      return res.status(400).json({ error: "anime_id, episode, fansub ve url zorunludur" });
    }

    const result = await db.collection("streams").insertOne(req.stream);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/editstream/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { episode, url, fansub } = req.body;

    const result = await db.collection("streams").updateOne(
      { mal_id: id },
      { $set: { episode: episode ? parseInt(episode) : undefined, url, fansub } }
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/getstream/:id/:episode", async (req, res) => {
  try {
    const stream = await db.collection("streams").findOne({
      mal_id: parseInt(req.params.id),
      episode: parseInt(req.params.episode)
    });
    if (!stream) return res.status(404).json({ error: "Stream bulunamadı" });
    res.json(stream);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bir animenin tüm streamlerini al
app.get("/api/getallstreams/:id", async (req, res) => {
  try {
    const streams = await db.collection("streams").find({
      mal_id: parseInt(req.params.id)
    }).toArray();
    res.json(streams);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
