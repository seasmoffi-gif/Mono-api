import express from 'express';
import bodyParser from 'body-parser';
import { supabase } from './supabase.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Anime bilgisi al
app.get('/api/getanime/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('animes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Bölüm linki al
app.get('/api/getstream/:id/:episode', async (req, res) => {
  const { id, episode } = req.params;
  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .eq('anime_id', id)
    .eq('episode', episode)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Yeni anime ekle
app.post('/api/addanime', async (req, res) => {
  const { title, description, image } = req.body;
  const { data, error } = await supabase
    .from('animes')
    .insert([{ title, description, image }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Anime düzenle
app.put('/api/editanime', async (req, res) => {
  const { id, title, description, image } = req.body;
  const { data, error } = await supabase
    .from('animes')
    .update({ title, description, image })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
