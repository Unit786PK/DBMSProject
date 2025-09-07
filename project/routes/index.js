import express from "express"
const router = express.Router();
import {sql} from "../db.js"

router.get(`/countries`, async(req, res) => {
  const countries = await sql`SELECT * FROM countries;`
  res.status(200).json(countries);
});

router.get(`/regions/:regionId`, async(req, res) => {
    const {regionId} = req.params
  const region = await sql`SELECT * FROM regions WHERE region_id = ${regionId};`
  res.status(200).json(region[0]);
 
});

export default router;