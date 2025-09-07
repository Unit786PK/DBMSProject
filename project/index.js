import express from "express";
import path, {dirname} from "path";
import {fileURLToPath} from 'url'
import indexRouter from "./routes/index.js"
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

app.get(`/`, (req, res) => res.sendFile(path.join(__dirname, "views/index.html")));
app.use('/api', indexRouter);

app.listen(PORT, ()=> console.log(`Server is listening on http://localhost:${PORT}`))