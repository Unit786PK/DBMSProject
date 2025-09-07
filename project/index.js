import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;

app.get(`/`, (req, res) => {
  
  res.json({ msg: `Hello World!` });
});

app.get(`/data`, async(req, res) => {
  const countries = await sql`SELECT * FROM countries;`
  res.status(200).json(countries);
  res.json({ msg: `Hello World!` });
});

app.listen(PORT, ()=> console.log(`Server is listening on http://localhost:${PORT}`))