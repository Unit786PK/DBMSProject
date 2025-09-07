import express from "express"
const router = express.Router();
import {sql} from "../db.js"

router.get(`/data`, async(req, res) => {
  const countries = await sql`SELECT * FROM countries;`
  res.status(200).json(countries);
  res.json({ msg: `Hello World!` });
});

export default router;